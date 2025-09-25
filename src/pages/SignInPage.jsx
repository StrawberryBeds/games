import React, { useState, useEffect } from 'react';
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from '../firebase';
import { useAuth } from '../context/authContext'; // Make sure you have this context
import { useNavigate } from 'react-router-dom'; // If using React Router for navigation

function SignInPage() {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const { currentUser } = useAuth(); // Get current user from auth context

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/player');
        }
    }, [currentUser, navigate]);

    const handleSignIn = async (email, password) => {
        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess("Signed in successfully!");
            setError('Email address or password is incorrect.');
            navigate('/player'); 
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
            <label>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
            </label>
            <button type="submit">Sign In</button>

        </form>
    );
}

export default SignInPage;
