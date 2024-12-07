import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificaionMessage(state, action) {
      return action.payload
    },
    clearNotificationMessage() {
      return null
    }
  }
})

export const { setNotificaionMessage, clearNotificationMessage } = notificationSlice.actions;
export default notificationSlice.reducer;