import { render, screen, fireEvent } from '@testing-library/react';
import NotificationItem from './NotificationItem';

describe('NotificationItem', () => {
  test('displays a default notification text in blue', () => {
    render(<NotificationItem id="1" type="default" value="New course available" markAsRead={() => {}} />);

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('New course available');
    expect(item).toHaveAttribute('data-notification-type', 'default');
    expect(item).toHaveStyle({ color: 'blue' });
  });

  test('displays an urgent notification text in red', () => {
    render(<NotificationItem id="2" type="urgent" value="New resume available" markAsRead={() => {}} />);

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('New resume available');
    expect(item).toHaveAttribute('data-notification-type', 'urgent');
    expect(item).toHaveStyle({ color: 'red' });
  });

  test('ignores any html prop and only renders the value', () => {
    render(
      <NotificationItem
        id="3"
        type="urgent"
        value="Plain value"
        html={{ __html: '<strong>Injected</strong>' }}
        markAsRead={() => {}}
      />
    );

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Plain value');
    expect(item.querySelector('strong')).toBeNull();
  });

  test('calls markAsRead with the correct id when clicked', () => {
    const markAsRead = jest.fn();
    render(<NotificationItem id="42" type="default" value="Test notification" markAsRead={markAsRead} />);

    fireEvent.click(screen.getByRole('listitem'));

    expect(markAsRead).toHaveBeenCalledTimes(1);
    expect(markAsRead).toHaveBeenCalledWith('42');
  });

  test('updates when its props change', () => {
    const markAsRead = jest.fn();
    const { rerender } = render(
      <NotificationItem id="1" type="urgent" value="New notification" markAsRead={markAsRead} />
    );

    rerender(<NotificationItem id="1" type="urgent" value="Updated notification" markAsRead={markAsRead} />);

    expect(screen.getByRole('listitem')).toHaveTextContent('Updated notification');
  });
});
