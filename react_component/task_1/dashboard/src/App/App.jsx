import { Component, Fragment } from 'react'
import './App.css'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import { getLatestNotification } from '../utils/utils'

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
]

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

class App extends Component {
  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(event) {
    // A synthetic event may carry no key at all, hence the guard before reading it.
    if (!event || !('key' in event)) return

    if (event.ctrlKey && String(event.key).toLowerCase() === 'h') {
      alert('Logging you out')

      const { logOut = () => {} } = this.props
      logOut()
    }
  }

  render() {
    const { isLoggedIn = false } = this.props

    return (
      <Fragment>
        <div className="root-notifications">
          <Notifications notifications={notificationsList} />
        </div>
        <Header />
        <div className="App-body">
          {isLoggedIn ? <CourseList courses={coursesList} /> : <Login />}
        </div>
        <Footer />
      </Fragment>
    )
  }
}

export default App
