import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth'
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import { ToastProvider } from '../hooks/useToast';
import { ConfirmProvider } from '../hooks/useConfirm';

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return <ToastProvider>
    <ConfirmProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ConfirmProvider>
  </ToastProvider>


}

export default MyApp
