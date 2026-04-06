import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import companyReducer from './slices/companySlice'

const persistConfig = {
  key: 'dabims',
  storage,
  whitelist: ['company'],
}

const rootReducer = combineReducers({
  company: companyReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }) as any,
})

export const persistor = persistStore(store)

// Derive types from the store itself
export type RootState = {
  company: ReturnType<typeof companyReducer>
}
export type AppDispatch = typeof store.dispatch
