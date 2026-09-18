import { Component } from 'react'
import closeButton from '../assets/close-button.png'
import NotificationItem from './NotificationItem'

class Notifications extends Component {
  constructor(props) {
    super(props)
    this.markAsRead = this.markAsRead.bind(this)
  }

  // Only a list of a different length is worth a new render.
  shouldComponentUpdate(nextProps) {
    return nextProps.notifications.length !== this.props.notifications.length
  }

  markAsRead(id) {
    console.log(`Notification ${id} has been marked as read`)
  }

  render() {
    const { displayDrawer, notifications } = this.props

    return (
      // Le panneau se place en haut à droite de la page et en occupe un quart.
      <div className="absolute top-1 right-3 w-100 max-[912px]:pr-3">
        <div className="notification-title text-right mb-1">
          Your notifications
        </div>
        {displayDrawer && (
          // Sous 912px le panneau recouvre l'écran entier : `fixed inset-0` le
          // sort du flux, `z-50` le place au-dessus du reste et `bg-white`
          // masque la page.
          <div className="notification-items border-[3px] border-dotted border-(--main-color) p-2 max-[912px]:fixed max-[912px]:inset-0 max-[912px]:z-50 max-[912px]:overflow-auto max-[912px]:bg-white max-[912px]:p-3">
            {notifications.length === 0 ? (
              <p className="max-[912px]:text-xl">No new notification for now</p>
            ) : (
              <>
                <button
                  aria-label="Close"
                  onClick={() => console.log('Close button has been clicked')}
                  style={{
                    float: 'right',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <img src={closeButton} alt="close" width="12" height="12" />
                </button>
                <p className="max-[912px]:text-xl">
                  Here is the list of notifications
                </p>
                {/* Le preflight de Tailwind remet les listes à zéro : les puces
                    et le retrait sont donc rétablis explicitement — puis retirés
                    sur mobile, où les items sont des lignes pleine largeur. */}
                <ul className="list-[square] pl-6 max-[912px]:mt-1 max-[912px]:list-none max-[912px]:pl-0">
                  {notifications.map(({ id, type, html, value }) => {
                    // A notification carrying markup is handed to
                    // dangerouslySetInnerHTML, whether it arrives under `html`
                    // or as an object-shaped `value`.
                    const markup =
                      html ??
                      (value !== null && typeof value === 'object'
                        ? value
                        : null)

                    return (
                      <NotificationItem
                        key={id}
                        id={id}
                        type={type}
                        html={markup}
                        value={markup ? undefined : value}
                        markAsRead={this.markAsRead}
                      />
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    )
  }
}

Notifications.defaultProps = {
  displayDrawer: false,
  notifications: [],
}

export default Notifications
