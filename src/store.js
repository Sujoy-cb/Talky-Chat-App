import { configureStore } from '@reduxjs/toolkit'
import activeChatSlice from './Slice/activeChatSlice'

export default configureStore({
  reducer: {
    activeChat: activeChatSlice,
  },
})