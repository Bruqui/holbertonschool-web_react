import { Profiler } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import Notifications from './Notifications';
import notificationsReducer, {
  fetchNotifications,
} from '../../features/notifications/notificationsSlice';

const notificationsData = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: '' } },
];

const VISIBLE_CLASS = /(^|\s)visible_\w+/;

const createStoreWithNotifications = async () => {
  const store = configureStore({
    reducer: {
      notifications: notificationsReducer,
    },
  });
  const promise = store.dispatch(fetchNotifications());
  mockAxios.mockResponse({ data: { notifications: notificationsData } });
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

describe('Notifications', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('displays the notification items fetched from the API', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');
    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument();
  });

  test('displays "Loading..." while fetching, then the notifications list once fetched', async () => {
    const store = configureStore({ reducer: { notifications: notificationsReducer } });
    renderNotifications(store);

    let promise;
    act(() => {
      promise = store.dispatch(fetchNotifications());
    });

    expect(store.getState().notifications.loading).toBe(true);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText(/here is the list of notifications/i)).not.toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    await act(async () => {
      mockAxios.mockResponse({ data: { notifications: notificationsData } });
      await promise;
    });

    expect(store.getState().notifications.loading).toBe(false);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('hides "Loading..." when the request fails', async () => {
    const store = configureStore({ reducer: { notifications: notificationsReducer } });
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

    expect(store.getState().notifications.loading).toBe(false);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(/no new notifications for now/i)).toBeInTheDocument();
  });

  test('displays "No new notifications for now" when the list is empty', () => {
    const store = configureStore({ reducer: { notifications: notificationsReducer } });
    renderNotifications(store);

    expect(screen.getByText(/no new notifications for now/i)).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('no longer keeps the drawer visibility in the Redux state', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    fireEvent.click(screen.getByText(/your notifications/i));

    expect(store.getState().notifications).not.toHaveProperty('displayDrawer');
  });

  test('toggles the Aphrodite "visible" style when "Your notifications" is clicked', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    const drawer = getDrawer();
    expect(drawer.className).not.toMatch(VISIBLE_CLASS);

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(drawer.className).toMatch(VISIBLE_CLASS);

    fireEvent.click(screen.getByText(/your notifications/i));
    expect(drawer.className).not.toMatch(VISIBLE_CLASS);
  });

  test('removes the Aphrodite "visible" style when the close button is clicked', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    const drawer = getDrawer();
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
    fireEvent.click(screen.getByText(/your notifications/i));

    expect(onRender).toHaveBeenCalledTimes(rendersAfterMount);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('removes a notification from the list when it is marked as read', async () => {
    const store = await createStoreWithNotifications();
    renderNotifications(store);

    fireEvent.click(screen.getByText('New resume available'));

    expect(store.getState().notifications.notifications.map(({ id }) => id)).toEqual([1, 3]);
    expect(screen.queryByText('New resume available')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(console.log).toHaveBeenCalledWith('Notification 2 has been marked as read');
  });
});
