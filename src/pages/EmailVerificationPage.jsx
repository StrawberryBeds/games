// pages/EmailVerificationPage.jsx
import { useAuth } from "../context/authContext";
import { sendEmailVerification } from "firebase/auth";
// import { auth } from '../firebase';
import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
import PendingEmailVerification from "../componentsSignUp/PendingEmailVerification";

function EmailVerificationPage() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  //   const navigate = useNavigate();

  const handleResendEmail = async () => {
    if (!currentUser) return;
    setResendLoading(true);
    try {
      await sendEmailVerification(currentUser);
      setMessage("Verification email resent! Please check your inbox.");
    } catch (error) {
      console.error("Error resending email verification", error.message);
      setMessage("Failed to resend email. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optionally navigate away or show a different UI
  };

  return (
    <div className="email-verification-page">
      <PendingEmailVerification show={isModalOpen} onClose={handleCloseModal}>
        <h2>Please Verify Your Email</h2>
        <p>
          We've sent a verification email to{" "}
          <strong>{currentUser?.email}</strong>. Please check your inbox and
          click the link to verify your account.
        </p>
        <p>
          After verifying, please sign-out and sign-in to create your profiles.
        </p>

        <p>Didn't receive the email?</p>
        <button onClick={handleResendEmail} disabled={resendLoading}>
          {resendLoading ? "Sending..." : "Resend Email"}
        </button>
        {message && <p className="message">{message}</p>}
      </PendingEmailVerification>

      {!isModalOpen && (
        <div className="verification-reminder">
          <p>Please verify your email to continue.</p>
          <button onClick={() => setIsModalOpen(true)}>
            Open Verification Prompt
          </button>
        </div>
      )}
    </div>
  );
}

export default EmailVerificationPage;
