import './Notifications.css'
import closeButton from '../assets/close-button.png'
import NotificationItem from './NotificationItem'

function Notifications({ notifications = [] }) {
  return (
    <div className="notification-items">
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
      <p>Here is the list of notifications</p>
      <ul>
        {notifications.map(({ id, type, html, value }) => {
          // A notification carrying markup is handed to dangerouslySetInnerHTML,
          // whether it arrives under `html` or as an object-shaped `value`.
          const markup =
            html ?? (value !== null && typeof value === 'object' ? value : null)

          return (
            <NotificationItem
              key={id}
              type={type}
              html={markup}
              value={markup ? undefined : value}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default Notifications
