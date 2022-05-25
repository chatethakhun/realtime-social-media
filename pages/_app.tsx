import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth'
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import { ToastProvider } from 'react-toast-notifications';
config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return <ToastProvider placement='bottom-right' autoDismiss={true}>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  </ToastProvider>
}

export default MyApp
