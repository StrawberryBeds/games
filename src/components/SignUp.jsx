import React, { useState } from 'react';

function SignUp() {
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

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
        // handleSignUp(userEmail, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <div>
                <label>Given Name</label>
                <input type="text" value={givenName} onChange={(e) => setGivenName(e.target.value)} name="givenName"/>
            </div>
            <div>
                <label>Family Name</label>
                <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} name="familyName"/>
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
