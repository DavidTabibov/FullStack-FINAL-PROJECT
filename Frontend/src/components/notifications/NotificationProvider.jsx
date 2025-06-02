import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NotificationProvider() {
    return (
        <ToastContainer
            position="top-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
}

export default NotificationProvider;