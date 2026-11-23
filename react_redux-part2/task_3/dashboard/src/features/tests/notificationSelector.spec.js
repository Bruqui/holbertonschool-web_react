import { getFilteredNotifications } from '../selectors/notificationSelector';
import { getFilteredNotifications as getFilteredNotificationsAlias } from '../selectors/notificationsSelector';

const notifications = [
  { id: 'a', type: 'urgent', isRead: false, value: 'Urgent 1' },
  { id: 'b', type: 'default', isRead: false, value: 'Default 1' },
  { id: 'c', type: 'urgent', isRead: false, value: 'Urgent 2' },
];

const createState = (list) => ({
  notifications: {
    notifications: list,
    loading: false,
  },
});

describe('getFilteredNotifications', () => {
  test('returns every notification when the filter is "all"', () => {
    expect(getFilteredNotifications(createState(notifications), 'all')).toEqual(notifications);
  });

  test('returns only urgent notifications when the filter is "urgent"', () => {
    expect(getFilteredNotifications(createState(notifications), 'urgent')).toEqual([
      notifications[0],
      notifications[2],
    ]);
  });

  test('returns only default notifications when the filter is "default"', () => {
    expect(getFilteredNotifications(createState(notifications), 'default')).toEqual([
      notifications[1],
    ]);
  });

  test('is memoized: same notifications and filter return the same array reference', () => {
    const state = createState(notifications);

    const first = getFilteredNotifications(state, 'urgent');
    const second = getFilteredNotifications({ ...state }, 'urgent');

    expect(second).toBe(first);
  });

  test('recomputes when the notifications array changes', () => {
    const first = getFilteredNotifications(createState(notifications), 'urgent');
    const second = getFilteredNotifications(createState(notifications.slice(1)), 'urgent');

    expect(second).not.toBe(first);
    expect(second).toEqual([notifications[2]]);
  });

  test('is also exported from notificationsSelector.js', () => {
    expect(getFilteredNotificationsAlias).toBe(getFilteredNotifications);
  });
});
