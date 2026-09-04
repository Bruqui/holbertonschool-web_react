import { render, screen } from '@testing-library/react'
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
})
