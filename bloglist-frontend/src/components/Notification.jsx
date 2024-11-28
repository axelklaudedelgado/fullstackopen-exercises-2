const Notification = ({ message, color = null }) => {
  if (message === null) {
    return null
  }

  if (color === 'green') {
    return (
      <div className="added">
        {message}
      </div>
    )
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default Notification