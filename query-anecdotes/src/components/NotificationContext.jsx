/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SHOW":
            return state = action.payload
        case "REMOVE":
            return state = null
        default:
            return state
    }
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch] }>
        {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext