import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders an h1 with the text School dashboard', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders the body and footer paragraphs', () => {
    render(<App />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        new RegExp(
          `copyright ${new Date().getFullYear()} - holberton school`,
          'i'
        )
      )
    ).toBeInTheDocument()
  })

  test('renders an img element', () => {
    render(<App />)

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })
})
