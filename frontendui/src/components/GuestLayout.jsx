import { Outlet, Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

export default function GuestLayout() {
    const { token } = useStateContext();

    // 1. Safety Check: If user is ALREADY logged in, send them to Home
    if (token) {
        return <Navigate to="/" />;
    }

    // 2. Render the page cleanly
    // We removed the 'bg-purple-50' and 'max-w-md' classes 
    // because Login.jsx and Signup.jsx now handle their own full-screen layout.
    return (
        <div>
            <Outlet />
        </div>
    );
}