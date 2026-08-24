import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'
import { getLatestNotification } from '../utils/utils'

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
]

describe('Notifications', () => {
  test('renders the notifications title', () => {
    render(<Notifications notifications={notificationsList} />)

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('renders a button element', () => {
    render(<Notifications notifications={notificationsList} />)

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  test('renders 3 li elements from the notifications prop', () => {
    const { container } = render(
      <Notifications notifications={notificationsList} />
    )

    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  test('renders the text of each notification', () => {
    const { container } = render(
      <Notifications notifications={notificationsList} />
    )
    const items = Array.from(container.querySelectorAll('li'))

    expect(items[0]).toHaveTextContent(/new course available/i)
    expect(items[1]).toHaveTextContent(/new resume available/i)
    // The third one is markup, so its tags are parsed rather than escaped.
    expect(items[2]).toHaveTextContent(/urgent requirement - complete by eod/i)
    expect(items[2].querySelector('strong')).toBeInTheDocument()
  })

  test('renders each notification with its type', () => {
    const { container } = render(
      <Notifications notifications={notificationsList} />
    )
    const items = Array.from(container.querySelectorAll('li'))

    expect(items[0]).toHaveAttribute('data-notification-type', 'default')
    expect(items[1]).toHaveAttribute('data-notification-type', 'urgent')
    expect(items[2]).toHaveAttribute('data-notification-type', 'urgent')
  })

  test('renders no li and does not crash without the notifications prop', () => {
    const { container } = render(<Notifications />)

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })

  test('logs to the console when the close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<Notifications notifications={notificationsList} />)

    // Nothing is logged until the button is actually hit.
    expect(consoleSpy).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    // Case-insensitive on the wording, but still strict enough to reject a
    // handler that logs a different message entirely.
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/close button has been clicked/i)
    )

    consoleSpy.mockRestore()
  })
})
