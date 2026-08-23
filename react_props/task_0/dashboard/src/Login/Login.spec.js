import { render } from '@testing-library/react'
import Login from './Login'

describe('Login', () => {
  test('renders without crashing', () => {
    const { container } = render(<Login />)

    expect(container).toBeInTheDocument()
  })
})
