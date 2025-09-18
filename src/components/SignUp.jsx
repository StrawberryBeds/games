import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useNavigate } from 'react-router-dom'; // If using React Router for navigation

function SignUp() {
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // For redirect after sign-up

    const handleSignUp = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccess("Account created successfully!");
            setError('');
            // Add logic to save givenName and familyName to user profile if needed
            // Add logic to send verification email. 
             navigate('/profile'); // Redirect to profile page after sign-up
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!givenName || !familyName || !userEmail || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        // Proceed with sign-up logic (e.g., call Firebase authentication)
        console.log('Form submitted:', { givenName, familyName, userEmail });
        
        handleSignUp(userEmail, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div>
                <label>Given Name</label>
                <input type="text" value={givenName} onChange={(e) => setGivenName(e.target.value)} name="givenName" />
            </div>
            <div>
                <label>Family Name</label>
                <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} name="familyName" />
            </div>
            <div>
                <label>Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} name="userEmail" />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
            </div>
            <div>
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default SignUp;
