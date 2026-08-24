function NotificationItem({ type = 'default', html, value }) {
  // The colours used to live in Notifications.css, keyed on the type attribute.
  const style = { color: type === 'urgent' ? 'red' : 'blue' }

  if (html) {
    return (
      <li
        data-notification-type={type}
        style={style}
        dangerouslySetInnerHTML={html}
      />
    )
  }

  return (
    <li data-notification-type={type} style={style}>
      {value}
    </li>
  )
}

export default NotificationItem
