// pages/EmailVerificationPage.jsx
import { useAuth } from "../context/authContext";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import PendingEmailVerification from "../componentsSignUp/PendingEmailVerification";
import { useTranslation, Trans } from 'react-i18next';

function EmailVerificationPage() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const handleResendEmail = async () => {
    if (!currentUser) return;
    setResendLoading(true);
    try {
      await sendEmailVerification(currentUser);
      setMessage(t("emailVerify.resend_success")); // Use a translation key for this message too
    } catch (error) {
      console.error("Error resending email verification", error.message);
      setMessage(t("emailVerify.resend_failure")); // Use a translation key for this message too
    } finally {
      setResendLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="email-verification-page">
      <PendingEmailVerification
        show={isModalOpen}
        onClose={handleCloseModal}
        currentUser={currentUser}
        resendLoading={resendLoading}
        message={message}
        handleResendEmail={handleResendEmail}
      >
        <h2>{t('emailVerify.heading')}</h2>
        <p>
          <Trans
            i18nKey="emailVerify.sent_to"
            values={{ email: currentUser?.email }}
            components={{ strong: <strong /> }}
          />
        </p>
        <p>
          <Trans
            i18nKey="emailVerify.return_to"
            components={{ 1: <a href="https://pantalone.games/" target="_blank" rel="noopener noreferrer" /> }}
          />
        </p>
        <p>{t('emailVerify.did_not_receive')}</p>
        <button onClick={handleResendEmail} disabled={resendLoading}>
          {resendLoading ? t('emailVerify.sending') : t('emailVerify.resend')}
        </button>
        {message && <p className="message">{message}</p>}
      </PendingEmailVerification>

      {!isModalOpen && (
        <div className="verification-reminder">
          <p>{t('emailVerify.please_verify')}</p>
          <button onClick={() => setIsModalOpen(true)}>
            {t('emailVerify.open_prompt')}
          </button>
        </div>
      )}
    </div>
  );
}

export default EmailVerificationPage;
