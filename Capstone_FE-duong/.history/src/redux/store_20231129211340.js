import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import profileReducer from './profileSlice'
import userReducer from './userSlice'
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
  
}

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  profile: profileReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})



export let persistor = persistStore(store)
