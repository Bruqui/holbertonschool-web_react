import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders an h1 with the text School dashboard', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders an img element', () => {
    render(<App />)

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })

  describe('when isLoggedIn is false', () => {
    test('renders the Login form', () => {
      const { container } = render(<App isLoggedIn={false} />)

      expect(
        screen.getByText(/login to access the full dashboard/i)
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()

      // Only the email and password fields count, not a submit/button input.
      const fields = Array.from(container.querySelectorAll('input')).filter(
        (input) => !['button', 'reset', 'submit'].includes(input.type)
      )
      expect(fields).toHaveLength(2)
      expect(container.querySelectorAll('label')).toHaveLength(2)
    })

    test('does not render the CourseList table', () => {
      const { container } = render(<App isLoggedIn={false} />)

      expect(container.querySelector('table#CourseList')).not.toBeInTheDocument()
    })

    test('is the default, so it also renders the Login form without the prop', () => {
      render(<App />)

      expect(
        screen.getByText(/login to access the full dashboard/i)
      ).toBeInTheDocument()
    })
  })

  describe('when isLoggedIn is true', () => {
    test('renders the CourseList table', () => {
      const { container } = render(<App isLoggedIn={true} />)

      expect(container.querySelector('table#CourseList')).toBeInTheDocument()
      expect(screen.getByText(/available courses/i)).toBeInTheDocument()
      expect(screen.getByText(/course name/i)).toBeInTheDocument()
    })

    test('does not render the Login form', () => {
      render(<App isLoggedIn={true} />)

      expect(
        screen.queryByText(/login to access the full dashboard/i)
      ).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^ok$/i })).not.toBeInTheDocument()
    })
  })

  describe('when ctrl + h is pressed', () => {
    let alertSpy

    beforeEach(() => {
      // jsdom has no alert, so the spy needs an implementation to stand in for it.
      alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    })

    afterEach(() => {
      alertSpy.mockRestore()
    })

    // Dispatched on the body so it bubbles up to a listener on either document or window.
    const pressCtrlH = () =>
      fireEvent.keyDown(document.body, { key: 'h', ctrlKey: true })

    test('calls the logOut function passed as a prop once', () => {
      const logOut = jest.fn()
      render(<App logOut={logOut} />)

      pressCtrlH()

      expect(logOut).toHaveBeenCalledTimes(1)
    })

    test('alerts with the string Logging you out', () => {
      render(<App logOut={() => {}} />)

      pressCtrlH()

      expect(alertSpy).toHaveBeenCalledWith('Logging you out')
    })

    test('does nothing once the component is unmounted', () => {
      const logOut = jest.fn()
      const { unmount } = render(<App logOut={logOut} />)

      unmount()
      pressCtrlH()

      expect(logOut).not.toHaveBeenCalled()
      expect(alertSpy).not.toHaveBeenCalled()
    })
  })

  test('does not log out when h is pressed without ctrl', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const logOut = jest.fn()
    render(<App logOut={logOut} />)

    fireEvent.keyDown(document.body, { key: 'h' })

    expect(logOut).not.toHaveBeenCalled()
    expect(alertSpy).not.toHaveBeenCalled()

    alertSpy.mockRestore()
  })
})
