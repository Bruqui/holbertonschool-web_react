import { fireEvent, render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  let alertSpy

  beforeEach(() => {
    // jsdom has no alert, so the spy needs an implementation to stand in for it.
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    alertSpy.mockRestore()
  })

  // Dispatched on the body so it bubbles up to a listener on body, document or window.
  const pressCtrlH = () =>
    fireEvent.keyDown(document.body, {
      key: 'h',
      code: 'KeyH',
      keyCode: 72,
      which: 72,
      ctrlKey: true,
    })

  test('calls the logOut function passed as a prop when ctrl and h are pressed', () => {
    const logOut = jest.fn()
    render(<App logOut={logOut} />)

    pressCtrlH()

    expect(logOut).toHaveBeenCalledTimes(1)
  })

  test('alerts with the string Logging you out when ctrl and h are pressed', () => {
    render(<App logOut={() => {}} />)

    pressCtrlH()

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringMatching(/logging you out/i)
    )
  })
})
