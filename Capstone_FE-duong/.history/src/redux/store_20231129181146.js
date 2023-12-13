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
    REGISTER,
  } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ['auth'],
  };
  const userPersistConfig = {
    key: "auth",
    version: 1,
    storage,
    blacklist: ['isFetching'],
  };
  const rootReducer = combineReducers({ auth: persistReducer(userPersistConfig, authReducer), user: userReducer, profile: profileReducer});
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  
  export let persistor = persistStore(store);