import React, { useState, useEffect } from 'react';
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from '../firebase';
import { useAuth } from '../context/authContext'; // Make sure you have this context
import { useNavigate } from 'react-router-dom'; // If using React Router for navigation
import { useTranslation } from 'react-i18next';
import ForgotPasswordDialogue from "../componentsSignIn/ForgotPasswordDialogue";


function SignInPage() {
    const { t } = useTranslation();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const { currentUser } = useAuth(); // Get current user from auth context
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);


    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/auth/player');
        }
    }, [currentUser, navigate]);

    const handleSignIn = async (email, password) => {
        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess("Signed in successfully!");
            setError('');
            navigate('/auth/player');
        } catch (error) {
            setError(error.message || 'Email address or password is incorrect.');
            setSuccess('');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!userEmail || !password) {
            setError(t('signIn.error_all_fields'));
            return;
        }

        console.log('Form submitted:', { userEmail });

        handleSignIn(userEmail, password);
    };


    return (
         <div className="page-wrapper">
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {/* Email and Password fields */}
            <div>
                <label>{t("signIn.email")}</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} name="userEmail" />
            </div>
            <div>
                <label>{t("signIn.password")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
            </div>
            <label>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                {t("signIn.remember_me")}
            </label>
            <button type="submit" disabled={!userEmail || !password}>
                {t("signIn.sign_in_button")}
            </button>
            <button type="button" onClick={() => setShowPasswordDialog(true)}>
                {t("signIn.forgot_password")}
            </button>
            {showPasswordDialog && (
                <ForgotPasswordDialogue
                    onClose={() => setShowPasswordDialog(false)}
                    defaultEmail={userEmail}
                />
            )}
        </form>
        </div>
    );
}

export default SignInPage;
