import '@mui/material/styles/styled'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './utils/pdfPolyfills'
import App from './App'
import './index.css'
import {Provider} from 'react-redux'
import {store} from './store'
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <App /> 
      </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>,
)
