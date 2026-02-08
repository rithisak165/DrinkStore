import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef(); 
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        };

        axiosClient.post('/register', payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                } else if (response && response.status === 500) {
                    // Capture server error if provided
                    setErrors({ server: [response.data.message || "Internal Server Error"] });
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
                <div className="w-full md:w-1/2 bg-amber-600 p-8 flex flex-col justify-center items-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Join Us</h2>
                    <p className="text-lg opacity-90 text-center">Create an account to start ordering.</p>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h2>

                    {errors && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            {Object.keys(errors).map(key => (
                                <p key={key} className="text-red-700 text-sm">{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
                        {/* Name */}
                        <input 
                            ref={nameRef} 
                            type="text" 
                            name="name"
                            autoComplete="off"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 outline-none" 
                            placeholder="Full Name" 
                        />
                        
                        {/* Email - Using new-password prevents autofill on some browsers */}
                        <input 
                            ref={emailRef} 
                            type="email" 
                            name="email"
                            autoComplete="new-password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 outline-none" 
                            placeholder="Email Address" 
                        />
                        
                        {/* Phone */}
                        <input 
                            ref={phoneRef} 
                            type="text" 
                            name="phone"
                            autoComplete="off"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 outline-none" 
                            placeholder="Phone Number" 
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                            {/* Password - Critical for stopping autofill */}
                            <input 
                                ref={passwordRef} 
                                type="password" 
                                name="password"
                                autoComplete="new-password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 outline-none" 
                                placeholder="Password" 
                            />
                            <input 
                                ref={passwordConfirmationRef} 
                                type="password" 
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 outline-none" 
                                placeholder="Confirm" 
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition">
                            {loading ? 'Creating...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="font-bold text-amber-600">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}