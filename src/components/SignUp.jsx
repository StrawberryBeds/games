import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Use setDoc instead of addDoc
import { useNavigate } from 'react-router-dom';
function SignUp() {
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
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
        try {
            // 1. Create user in Firebase Authentication            
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
            const user = userCredential.user;
            await sendEmailVerification(userCredential.user);
            alert('Registration successful! Please check your email for verification.');
            // Redirect or perform other actions after successful registration and email sent            

            // 2. Create user profile in Firestore            
            await setDoc(doc(db, 'users', user.uid), {
                userId: user.uid,
                givenName: givenName,
                familyName: familyName,
                userEmail: userEmail,
                createdAt: new Date().toISOString()
            });
            // 3. Create parent player profile in Firestore            
            await setDoc(doc(db, 'players', user.uid), {
                playerId: user.uid,
                isParent: true,
                givenName: givenName,
                familyName: familyName,
                userEmail: userEmail,
                createdAt: new Date().toISOString()
            });
            setSuccess("Account and profiles created successfully!");
            navigate('/profile');
            // Redirect only after all operations        
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
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
