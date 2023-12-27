// import { configureStore } from '@reduxjs/toolkit';
// import thunk from 'redux-thunk';
// import packagingDetail from './packaging';
// import loaderSlice from './loader';
// import { combineReducers } from 'redux';

// const reducers = combineReducers({ packagingDetail, loaderSlice });

// export const store = configureStore({
//     reducer: reducers,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
// });

import { configureStore } from '@reduxjs/toolkit'
import packagingReducer from './packaging';
import loaderReducer from './loader';

export const store = configureStore({
  reducer: {
    packaging: packagingReducer,
    loader: loaderReducer,
  },
})