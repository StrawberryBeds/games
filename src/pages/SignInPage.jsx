import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/authContext';

import { useNavigate } from 'react-router-dom'; // If using React Router for navigation

function SignInPage() {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

        // Redirect if already logged in
    if (useEffect.currentUser) {
        navigate('/');
        return null;
    }

    const handleSignIn = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess("Signed in successfully!");
            setError('Email address or password is incorrect.');

            // Add logic to save givenName and familyName to user profile if needed
            // Add logic to send verification email. 
            navigate('/'); // Redirect to home page after sign-in
        } catch (error) {
            setError('Email address or password is incorrect.', error.message);
            setSuccess('');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!userEmail || !password) {
            setError("Please fill in all required fields.");
            return;
        }
        // Proceed with sign-up logic (e.g., call Firebase authentication)
        console.log('Form submitted:', { userEmail });

        handleSignIn(userEmail, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div>
                <label>Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} name="userEmail" />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}

export default SignInPage;
