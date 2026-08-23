import { render } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  test('renders without crashing', () => {
    const { container } = render(<Footer />)

    expect(container).toBeInTheDocument()
  })
})
