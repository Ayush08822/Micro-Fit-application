import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { App } from './App'
import { store } from './store/store'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <AuthProvider authConfig={authConfig}>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>
)
