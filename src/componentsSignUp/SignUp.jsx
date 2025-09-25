import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const navigate = useNavigate();

    // Only set up the auth listener after verification email is sent
    useEffect(() => {
      if (!verificationSent) return;

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user?.emailVerified) {
          navigate('/createprofile');
        }
      });

      return unsubscribe;
    }, [verificationSent, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!userEmail || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
            const user = userCredential.user;

            // 2. Create user and player documents
            const now = new Date();

            // User document (for financial info)
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: now,
                // Other financial-related fields can be added later
            });

            // Player document (for game data)
            await setDoc(doc(db, "players", user.uid), {
                email: user.email,
                createdAt: now,
                isParent: true,
                familyId: user.uid,
                name: user.email.split('@')[0],
                setupComplete: false, // Flag for profile completion
                // Other game-related fields can be added later
            });

            // 3. Send verification email
            await sendEmailVerification(user);
            setVerificationSent(true);
            setSuccess("Account created! Please check your email for verification. After verifying, you'll be redirected to complete your profile setup.");
            alert('Registration successful! Please check your email for verification.');

            // Don't redirect yet - wait for email verification
        } catch (error) {
            console.error("Sign up error:", error);
            setError(error.code === 'auth/email-already-in-use'
                ? 'This email is already registered.'
                : 'Registration failed. Please try again.');
            setSuccess('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    name="userEmail"
                    required
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    minLength="6"
                    required
                />
            </div>

            <div>
                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirmPassword"
                    minLength="6"
                    required
                />
            </div>

            <button type="submit" disabled={isLoading || verificationSent}>
                {isLoading ? 'Creating Account...' :
                 verificationSent ? 'Check Your Email' : 'Sign Up'}
            </button>
        </form>
    );
}

export default SignUp;
