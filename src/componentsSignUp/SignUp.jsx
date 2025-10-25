// componentsSignUp/SignUp.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import PendingEmailVerification from './PendingEmailVerification'
import { useTranslation, Trans } from 'react-i18next';

function SignUp() {
  const [userEmail, setUserEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
    const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!userEmail || !confirmEmail || !password || !confirmPassword) {
      setError(t('signUp.error_all_fields'));
      setIsLoading(false);
      return;
    }

    if (userEmail !== confirmEmail) {
      setError(t('signUp.error_email_match'));
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(t('signUp.error_password_reqs'));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('signUp.error_password_match'));
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;

      // 2. Create user and player documents
      const now = new Date();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: now,
      });

      await setDoc(doc(db, "players", user.uid), {
        email: user.email,
        createdAt: now,
        isParent: true,
        familyId: user.uid,
        name: user.email.split('@')[0],
        setupComplete: false,
      });

      // 3. Send verification email
      await sendEmailVerification(user);
      console.log("SignUp.jsx - Verification email sent to", user.email)
      setSuccess(t('signUp.success_email_verification_sent'));
      setShowVerificationModal(true);

    } catch (error) {
      console.error("Sign up error:", error);
      setError(error.code === 'auth/email-already-in-use'
        ? t('signUp.email_in_use')
        : t('signUp.registration_failed'));
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    navigate('/'); // Or redirect to a waiting page
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div>
          <label>{t('signUp.email')}</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            name="userEmail"
            required
          />
        </div>

        <div>
          <label>{t('signUp.confirm_email')}</label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            name="userEmail"
            required
          />
        </div>

        <div>
          <label>{t('signUp.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            minLength="10"
            required
          />
        </div>
        <div>
          <label>{t('signUp.confirm_password')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirmPassword"
            minLength="10"
            required
          />
        </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? t('signUp.button_loading') : t('signUp.button')}
      </button>
      </form>

<PendingEmailVerification
  show={showVerificationModal}
  onClose={handleCloseModal}
  currentUser={{ email: userEmail }} // Mock currentUser object for consistency
  resendLoading={isLoading}
  message={success}
  handleResendEmail={() => {
    sendEmailVerification(auth.currentUser)
      .then(() => setSuccess(t('emailVerify.resend_success')))
      .catch(() => setError(t('emailVerify.resend_failure')));
  }}
>
  <h2>{t('emailVerify.heading')}</h2>
  <p>
    <Trans
      i18nKey="emailVerify.sent_to"
      values={{ email: userEmail }}
      components={{ strong: <strong /> }}
    />
  </p>
  <p>
    <Trans
      i18nKey="emailVerify.return_to"
      components={{ 1: <a href="https://pantalone.games" target="_blank" rel="noopener noreferrer" /> }}
    />
  </p>
  <p>{t('emailVerify.did_not_receive')}</p>
  <button onClick={() => {
    sendEmailVerification(auth.currentUser)
      .then(() => setSuccess(t('emailVerify.resend_success')))
      .catch(() => setError(t('emailVerify.resend_failure')));
  }} disabled={isLoading}>
    {isLoading ? t('emailVerify.sending') : t('emailVerify.resend')}
  </button>
  {message && <p className="message">{message}</p>}
</PendingEmailVerification>
    </>
  );
}

export default SignUp;
