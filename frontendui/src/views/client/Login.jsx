import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({ email: [response.data.message] });
                    }
                } else {
                    console.error(err);
                }
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side */}
                <div className="w-full md:w-1/2 bg-amber-800 p-8 flex flex-col justify-center items-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-lg opacity-90 text-center">Login to your account.</p>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>

                    {errors && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            {Object.keys(errors).map(key => (
                                <p key={key} className="text-red-700 text-sm">{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <input ref={emailRef} type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 outline-none" placeholder="Email" />
                        <input ref={passwordRef} type="password" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 outline-none" placeholder="Password" />

                        <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        No account? <Link to="/signup" className="font-bold text-amber-600">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}