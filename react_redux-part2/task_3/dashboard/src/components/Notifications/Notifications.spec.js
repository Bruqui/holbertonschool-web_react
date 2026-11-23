import { Profiler } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import Notifications from './Notifications';
import notificationsReducer, {
  fetchNotifications,
} from '../../features/notifications/notificationsSlice';

const apiNotifications = [
  {
    id: '5debd76480edafc8af244228',
    context: { isRead: true, type: 'urgent', value: 'Lorem ipsum dolor sit amet (read).' },
  },
  {
    id: '5debd764507712e7a1307303',
    context: { isRead: false, type: 'urgent', value: 'ut labore et dolore magna aliqua.' },
  },
  {
    id: '5debd76444dd4dafea89d53b',
    context: { isRead: false, type: 'urgent', value: 'Non diam phasellus vestibulum lorem.' },
  },
  {
    id: '5debd7644aaed86c97bf9d5e',
    context: { isRead: false, type: 'default', value: 'Cursus metus aliquam eleifend.' },
  },
  {
    id: '5debd7642e815cd350407777',
    context: { isRead: true, type: 'default', value: 'Est ante in nibh mauris (read).' },
  },
];

const URGENT_VALUES = ['ut labore et dolore magna aliqua.', 'Non diam phasellus vestibulum lorem.'];
const DEFAULT_VALUES = ['Cursus metus aliquam eleifend.'];
const VISIBLE_CLASS = /(^|\s)visible_\w+/;

const createStore = () =>
  configureStore({
    reducer: {
      notifications: notificationsReducer,
    },
  });

const createStoreWithNotifications = async (data = apiNotifications) => {
  const store = createStore();
  const promise = store.dispatch(fetchNotifications());
  mockAxios.mockResponse({ data });
  await promise;
  return store;
};

const renderNotifications = (store, onRender = () => {}) =>
  render(
    <Provider store={store}>
      <Profiler id="Notifications" onRender={onRender}>
        <Notifications />
      </Profiler>
    </Provider>
  );

const getDrawer = () => screen.getByText(/here is the list of notifications/i).parentElement;
const displayedValues = () => screen.getAllByRole('listitem').map((item) => item.textContent);

describe('Notifications', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('displays only the unread notifications fetched from the API', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');
    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    expect(displayedValues()).toEqual([...URGENT_VALUES, ...DEFAULT_VALUES]);
    expect(screen.queryByText(/\(read\)/)).not.toBeInTheDocument();
  });

  test('displays the urgent and default filter buttons', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    expect(screen.getByRole('button', { name: '‼️' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '??' })).toBeInTheDocument();
  });

  test('filters on urgent notifications, and back to all on a second click', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    fireEvent.click(screen.getByRole('button', { name: '‼️' }));
    expect(displayedValues()).toEqual(URGENT_VALUES);
    screen.getAllByRole('listitem').forEach((item) => {
      expect(item).toHaveAttribute('data-notification-type', 'urgent');
    });

    fireEvent.click(screen.getByRole('button', { name: '‼️' }));
    expect(displayedValues()).toEqual([...URGENT_VALUES, ...DEFAULT_VALUES]);
  });

  test('filters on default notifications, and back to all on a second click', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    fireEvent.click(screen.getByRole('button', { name: '??' }));
    expect(displayedValues()).toEqual(DEFAULT_VALUES);
    expect(screen.getByRole('listitem')).toHaveAttribute('data-notification-type', 'default');

    fireEvent.click(screen.getByRole('button', { name: '??' }));
    expect(displayedValues()).toEqual([...URGENT_VALUES, ...DEFAULT_VALUES]);
  });

  test('switches directly between the urgent and default filters', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    fireEvent.click(screen.getByRole('button', { name: '‼️' }));
    expect(displayedValues()).toEqual(URGENT_VALUES);

    fireEvent.click(screen.getByRole('button', { name: '??' }));
    expect(displayedValues()).toEqual(DEFAULT_VALUES);

    fireEvent.click(screen.getByRole('button', { name: '‼️' }));
    expect(displayedValues()).toEqual(URGENT_VALUES);
  });

  test('filtering does not change the notifications in the Redux store', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);
    const before = store.getState().notifications.notifications;

    fireEvent.click(screen.getByRole('button', { name: '‼️' }));

    expect(store.getState().notifications.notifications).toBe(before);
    expect(before).toHaveLength(3);
  });

  test('displays "Loading..." while fetching, then the notifications list once fetched', async () => {
    const store = createStore();
    renderNotifications(store);

    let promise;
    act(() => {
      promise = store.dispatch(fetchNotifications());
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    await act(async () => {
      mockAxios.mockResponse({ data: apiNotifications });
      await promise;
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('hides "Loading..." when the request fails', async () => {
    const store = createStore();
    renderNotifications(store);

    let promise;
    act(() => {
      promise = store.dispatch(fetchNotifications());
    });
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      mockAxios.mockError(new Error('Network Error'));
      await promise;
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(/no new notifications for now/i)).toBeInTheDocument();
  });

  test('displays "No new notifications for now" when every notification is read', async () => {
    const store = await createStoreWithNotifications(
      apiNotifications.filter(({ context }) => context.isRead)
    );
    renderNotifications(store);

    expect(screen.getByText(/no new notifications for now/i)).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('toggles the Aphrodite "visible" style with "Your notifications" and the close button', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    const drawer = getDrawer();
    expect(drawer.className).not.toMatch(VISIBLE_CLASS);

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(drawer.className).toMatch(VISIBLE_CLASS);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(drawer.className).not.toMatch(VISIBLE_CLASS);
  });

  test('does not re-render when the drawer is shown or hidden', async () => {
    const store = await createStoreWithNotifications();
    const onRender = jest.fn();
    renderNotifications(store, onRender);

    const rendersAfterMount = onRender.mock.calls.length;

    fireEvent.click(screen.getByText(/your notifications/i));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    fireEvent.click(screen.getByText(/your notifications/i));

    expect(onRender).toHaveBeenCalledTimes(rendersAfterMount);
  });

  test('removes a notification from the list when it is marked as read', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    fireEvent.click(screen.getByText('ut labore et dolore magna aliqua.'));

    expect(store.getState().notifications.notifications.map(({ id }) => id)).toEqual([
      '5debd76444dd4dafea89d53b',
      '5debd7644aaed86c97bf9d5e',
    ]);
    expect(screen.queryByText('ut labore et dolore magna aliqua.')).not.toBeInTheDocument();
    expect(console.log).toHaveBeenCalledWith(
      'Notification 5debd764507712e7a1307303 has been marked as read'
    );
  });
});
