import mockAxios from 'jest-mock-axios';
import { configureStore } from '@reduxjs/toolkit';
import * as notificationsSlice from '../notifications/notificationsSlice';
import notificationsReducer, {
  fetchNotifications,
  markNotificationAsRead,
} from '../notifications/notificationsSlice';

const apiNotifications = [
  {
    id: '5debd76480edafc8af244228',
    author: { id: '5debd764a7c57c7839d722e9', email: 'poole.sanders@holberton.nz' },
    context: {
      guid: '2d8e40be-1c78-4de0-afc9-fcc147afd4d2',
      isRead: true,
      type: 'urgent',
      value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    },
  },
  {
    id: '5debd764507712e7a1307303',
    author: { id: '5debd7648ba8641ce0a34ea4', email: 'norton.grimes@holberton.nz' },
    context: {
      guid: 'cec84b7a-7be4-4af0-b833-f1485433f66e',
      isRead: false,
      type: 'urgent',
      value: 'ut labore et dolore magna aliqua.',
    },
  },
  {
    id: '5debd7644aaed86c97bf9d5e',
    author: { id: '5debd764f5017139ce541857', email: 'mason.douglas@holberton.nz' },
    context: {
      guid: 'de55f849-8fca-4ac7-afbb-41751f09d0c6',
      isRead: false,
      type: 'default',
      value: 'Cursus metus aliquam eleifend mi in nulla posuere.',
    },
  },
  {
    id: '5debd7642e815cd350407777',
    author: { id: '5debd764f8452ef92346c772', email: 'cherry.miles@holberton.nz' },
    context: {
      guid: '3068c575-d619-40af-bf12-dece1ee18dd3',
      isRead: true,
      type: 'default',
      value: 'Est ante in nibh mauris cursus mattis molestie a iaculis.',
    },
  },
];

const unreadNotifications = [
  {
    id: '5debd764507712e7a1307303',
    type: 'urgent',
    isRead: false,
    value: 'ut labore et dolore magna aliqua.',
  },
  {
    id: '5debd7644aaed86c97bf9d5e',
    type: 'default',
    isRead: false,
    value: 'Cursus metus aliquam eleifend mi in nulla posuere.',
  },
];

describe('notificationsSlice', () => {
  const initialState = {
    notifications: [],
    loading: false,
  };

  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    logSpy.mockRestore();
  });

  test('returns the correct initial state by default', () => {
    expect(notificationsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('no longer holds any drawer visibility state or action', () => {
    expect(notificationsReducer(undefined, { type: 'unknown' })).not.toHaveProperty('displayDrawer');
    expect(notificationsSlice.showDrawer).toBeUndefined();
    expect(notificationsSlice.hideDrawer).toBeUndefined();
  });

  test('fetches notifications and keeps only the unread ones with id, type, isRead and value', async () => {
    const store = configureStore({ reducer: { notifications: notificationsReducer } });

    const promise = store.dispatch(fetchNotifications());

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');
    mockAxios.mockResponse({ data: apiNotifications });
    await promise;

    expect(store.getState().notifications.notifications).toEqual(unreadNotifications);
  });

  test('updates notifications when fetchNotifications is fulfilled', () => {
    const state = notificationsReducer(initialState, {
      type: fetchNotifications.fulfilled.type,
      payload: unreadNotifications,
    });

    expect(state.notifications).toEqual(unreadNotifications);
  });

  test('sets loading to true while fetchNotifications is pending', () => {
    const state = notificationsReducer(initialState, { type: fetchNotifications.pending.type });

    expect(state.loading).toBe(true);
    expect(state.notifications).toEqual([]);
  });

  test('sets loading to false when fetchNotifications is fulfilled', () => {
    const state = notificationsReducer(
      { ...initialState, loading: true },
      { type: fetchNotifications.fulfilled.type, payload: unreadNotifications }
    );

    expect(state.loading).toBe(false);
    expect(state.notifications).toEqual(unreadNotifications);
  });

  test('sets loading to false when fetchNotifications is rejected', () => {
    const state = notificationsReducer(
      { ...initialState, loading: true },
      { type: fetchNotifications.rejected.type, error: { message: 'Network Error' } }
    );

    expect(state.loading).toBe(false);
    expect(state.notifications).toEqual([]);
  });

  test('toggles loading through a real request lifecycle', async () => {
    const store = configureStore({ reducer: { notifications: notificationsReducer } });

    const promise = store.dispatch(fetchNotifications());
    expect(store.getState().notifications.loading).toBe(true);

    mockAxios.mockError(new Error('Network Error'));
    await promise;

    expect(store.getState().notifications.loading).toBe(false);
    expect(store.getState().notifications.notifications).toEqual([]);
  });

  test('removes a notification when markNotificationAsRead is dispatched', () => {
    const state = notificationsReducer(
      { ...initialState, notifications: unreadNotifications },
      markNotificationAsRead('5debd764507712e7a1307303')
    );

    expect(state.notifications).toEqual([unreadNotifications[1]]);
    expect(logSpy).toHaveBeenCalledWith(
      'Notification 5debd764507712e7a1307303 has been marked as read'
    );
  });
});
