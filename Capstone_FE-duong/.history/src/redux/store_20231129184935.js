import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import userReducer from './userSlice'
import profileReducer from './profileSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['login.isFetching'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  profile: profileReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
  transforms: [
    {
      in: (state) => {
        return {
          auth: {
            login: {
              currentUser: state.auth.login.currentUser,
            },
          },
        };
      },
      out: (state) => {
        // You can define the reverse transformation if needed
        return {
          auth: {
            login: {
              currentUser: state.auth.login.currentUser,
            },
          },
        };
      },
    },
  ],
};


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
