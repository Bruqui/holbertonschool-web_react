import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'

describe('Notifications', () => {
  test('renders the notifications title', () => {
    render(<Notifications />)

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('renders a button element', () => {
    render(<Notifications />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('renders 3 li elements', () => {
    const { container } = render(<Notifications />)

    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  test('logs to the console when the close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<Notifications />)

    fireEvent.click(screen.getByRole('button'))

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/close button has been clicked/i)
    )

    consoleSpy.mockRestore()
  })
})
