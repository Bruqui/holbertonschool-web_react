import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// The password lives in App's user state but is never displayed. The Header is
// therefore wrapped with a probe that renders the real Header next to the user
// it reads from the context, which is exactly the user state App provides.
// createElement rather than JSX: a jest.mock factory may not reach the JSX
// runtime that Babel would import for it.
jest.mock('../Header/Header', () => {
  const { createElement, Fragment, useContext } = jest.requireActual('react')
  const { default: ActualHeader } = jest.requireActual('../Header/Header')
  const { default: context } = jest.requireActual('../Context/context')

  return {
    __esModule: true,
    default: function HeaderWithUserProbe() {
      const { user } = useContext(context)

      return createElement(
        Fragment,
        null,
        createElement(ActualHeader),
        createElement('output', { 'data-testid': 'user-state', hidden: true }, JSON.stringify(user))
      )
    },
  }
})

const userState = () =>
  JSON.parse(screen.getByTestId('user-state').textContent)

describe('App', () => {
  beforeEach(() => {
    // WithLogging logs every mount and unmount of the Login form.
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // App no longer takes isLoggedIn as a prop: logging in goes through the form,
  // exactly as a visitor would.
  const logIn = async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret-password')
    await user.click(screen.getByRole('button', { name: /^ok$/i }))
  }

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

  test('renders the News from the School section by default', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /news from the school/i })
    ).toBeInTheDocument()
    // Le texte de cette section est le Lorem ipsum imposé par l'énoncé pour
    // éprouver le retour à la ligne ; on n'en vérifie qu'un fragment stable.
    expect(
      screen.getByText(/lorem ipsum dolor sit amet/i)
    ).toBeInTheDocument()
  })

  test('wraps the Login form in a body section titled Log in to continue', () => {
    const { container } = render(<App />)

    expect(
      screen.getByRole('heading', { name: /log in to continue/i })
    ).toBeInTheDocument()
    expect(
      container.querySelectorAll('.bodySectionWithMargin')
    ).not.toHaveLength(0)
  })

  test('renders the Login form until the user logs in', () => {
    const { container } = render(<App />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
    expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
  })

  test('renders the CourseList in place of the Login form once logged in', async () => {
    const { container } = render(<App />)

    await logIn()

    expect(container.querySelector('#CourseList')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /course list/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/available courses/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/login to access the full dashboard/i)
    ).not.toBeInTheDocument()
  })

  test('wraps the CourseList in a body section titled Course list', async () => {
    const { container } = render(<App />)

    await logIn()

    // The section holding the table is the one carrying the bottom margin.
    const wrapper = container
      .querySelector('#CourseList')
      .closest('.bodySectionWithMargin')
    expect(wrapper).toBeInTheDocument()
  })

  // The drawer state lives in App, so the whole open/close round trip is
  // checked through the rendered page.
  test('opens the notifications drawer by default', () => {
    render(<App />)

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('reopens the notifications drawer when Your notifications is clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('closes the notifications drawer when the close button is clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText(/your notifications/i))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(
      screen.queryByText(/here is the list of notifications/i)
    ).not.toBeInTheDocument()
  })

  describe('marking a notification as read', () => {
    test('removes the clicked item from the list and logs its id', () => {
      const { container } = render(<App />)
      fireEvent.click(screen.getByText(/your notifications/i))

      fireEvent.click(screen.getByText(/new course available/i))

      expect(
        screen.queryByText(/new course available/i)
      ).not.toBeInTheDocument()
      expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/notification 1 has been marked as read/i)
      )
    })

    test('removes only the item that was clicked, whatever its position', () => {
      const { container } = render(<App />)
      fireEvent.click(screen.getByText(/your notifications/i))

      fireEvent.click(screen.getByText(/new resume available/i))

      const remaining = Array.from(
        container.querySelectorAll('.notification-items li')
      )
      expect(remaining).toHaveLength(2)
      expect(remaining[0]).toHaveTextContent(/new course available/i)
      expect(remaining[1]).toHaveTextContent(/urgent requirement/i)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/notification 2 has been marked as read/i)
      )
    })

    test('shows the empty state once every notification is read', () => {
      const { container } = render(<App />)
      fireEvent.click(screen.getByText(/your notifications/i))

      // The first item is clicked three times over: the list shifts each time.
      for (let i = 0; i < 3; i += 1) {
        fireEvent.click(container.querySelector('.notification-items li'))
      }

      expect(
        screen.getByText(/no new notification for now/i)
      ).toBeInTheDocument()
    })
  })

  describe('the Contact us link of the Footer', () => {
    test('is not displayed before logging in', () => {
      render(<App />)

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('appears once logged in and goes away after logging out', async () => {
      render(<App />)

      await logIn()
      expect(
        screen.getByRole('link', { name: /contact us/i })
      ).toBeInTheDocument()

      fireEvent.click(screen.getByText(/^logout$/i))
      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })
  })

  test('keeps the notifications drawer working once logged in', async () => {
    render(<App />)

    await logIn()
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  // The user lives in App's state and reaches the Header through the context:
  // logging in and out must show up in both places at once.
  describe('the logout section of the Header', () => {
    test('is not rendered before logging in', () => {
      const { container } = render(<App />)

      expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('welcomes the user by email once logged in', async () => {
      const { container } = render(<App />)

      await logIn()

      expect(container.querySelector('#logoutSection')).toHaveTextContent(
        /welcome user@example\.com/i
      )
    })

    test('logs the user out when logout is clicked', async () => {
      const { container } = render(<App />)
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(container.querySelector('#logoutSection')).toBeNull()
      expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
      expect(
        screen.getByText(/login to access the full dashboard/i)
      ).toBeInTheDocument()
    })

    test('starts the Login form empty again after logging out', async () => {
      render(<App />)
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/password/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()
    })
  })

  test('is a function component', () => {
    expect(typeof App).toBe('function')
    expect(App.prototype?.isReactComponent).toBeUndefined()
  })

  // Ctrl+H and its keyboard listener are gone with the class lifecycle methods.
  test('no longer logs out or alerts when ctrl and h are pressed', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const { container } = render(<App />)
    await logIn()

    fireEvent.keyDown(document, { key: 'h', ctrlKey: true })

    expect(alertSpy).not.toHaveBeenCalled()
    expect(container.querySelector('#CourseList')).toBeInTheDocument()
  })

  // handleDisplayDrawer and handleHideDrawer reach the drawer as callbacks:
  // their effect is read on the displayDrawer state, through the page.
  describe('handleDisplayDrawer and handleHideDrawer', () => {
    const drawerIsOpen = (container) =>
      container.querySelector('.notification-items') !== null

    test('handleHideDrawer sets displayDrawer to false', () => {
      const { container } = render(<App />)
      expect(drawerIsOpen(container)).toBe(true)

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(drawerIsOpen(container)).toBe(false)
    })

    test('handleDisplayDrawer sets displayDrawer to true', () => {
      const { container } = render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(true)
    })

    test('handleDisplayDrawer keeps an open drawer open', () => {
      const { container } = render(<App />)

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(true)
    })

    test('can be toggled again and again', () => {
      const { container } = render(<App />)

      for (let i = 0; i < 2; i += 1) {
        fireEvent.click(screen.getByRole('button', { name: /close/i }))
        expect(drawerIsOpen(container)).toBe(false)
        fireEvent.click(screen.getByText(/your notifications/i))
        expect(drawerIsOpen(container)).toBe(true)
      }
    })
  })

  describe('the user state', () => {
    test('starts as the user of the context: logged out, no credentials', () => {
      render(<App />)

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn sets the email, the password and isLoggedIn to true', async () => {
      render(<App />)

      await logIn()

      expect(userState()).toEqual({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })
    })

    test('logOut sets isLoggedIn to false and clears the email and password', async () => {
      render(<App />)
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn works again after a logOut, with the new credentials', async () => {
      const user = userEvent.setup()
      render(<App />)
      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      await user.type(screen.getByLabelText(/email/i), 'other@example.com')
      await user.type(screen.getByLabelText(/password/i), 'other-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(userState()).toEqual({
        email: 'other@example.com',
        password: 'other-password',
        isLoggedIn: true,
      })
    })
  })

  test('keeps the notifications when the user logs in and out', async () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByText(/new course available/i))

    await logIn()
    fireEvent.click(screen.getByText(/^logout$/i))

    // The list is its own state: a user update leaves it untouched.
    expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
  })
})
