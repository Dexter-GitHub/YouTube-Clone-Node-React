import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker'
// import reportWebVitals from './reportWebVitals';
import promiseMiddleware from 'redux-promise';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './_reducers';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(promiseMiddleware, thunk),
    devTools: process.env.NODE_ENV !== 'production', // DevTools 설정
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store = {store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
// reportWebVitals();
