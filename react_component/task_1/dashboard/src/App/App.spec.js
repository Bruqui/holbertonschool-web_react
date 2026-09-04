import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  // Control held down, h pressed and released, control released — a real key sequence.
  // Each fallback below runs only while nothing has reacted yet, so the handler of a
  // component that does react is never triggered twice.
  const pressCtrlH = async (logOut) => {
    const reacted = () =>
      alertSpy.mock.calls.length > 0 || logOut.mock.calls.length > 0

    await userEvent.setup().keyboard('{Control>}h{/Control}')
    if (reacted()) return

    // userEvent leaves the deprecated keyCode unset, so a handler reading it needs this.
    const init = { key: 'h', code: 'KeyH', keyCode: 72, which: 72, ctrlKey: true }
    fireEvent.keyDown(document.body, init)
    if (reacted()) return

    fireEvent.keyUp(document.body, init)
  }

  test('calls the logOut function passed as a prop when ctrl and h are pressed', async () => {
    const logOut = jest.fn()
    render(<App logOut={logOut} />)

    await pressCtrlH(logOut)

    expect(logOut).toHaveBeenCalledTimes(1)
  })

  test('alerts with the string Logging you out when ctrl and h are pressed', async () => {
    const logOut = jest.fn()
    render(<App logOut={logOut} />)

    await pressCtrlH(logOut)

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringMatching(/logging you out/i)
    )
  })
})
