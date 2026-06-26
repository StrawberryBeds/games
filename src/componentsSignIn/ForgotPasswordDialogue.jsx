// ForgotPasswordDialogue.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";

function ForgotPasswordDialogue({ onClose, defaultEmail = "" }) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async () => {
    console.log("Password reset email requested")
    setError("");
    setSuccess("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(t("manageProfiles.success_password_reset_sent"));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{t("signIn.forgot_password")}</h2>
        <div> {/* <-- Changed from <form> to <div> */}
          <label>{t("signIn.enter_email_for_reset")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button
            type="button"
            onClick={handleSubmit} 
          >
            {t("signIn.send_reset_link")}
          </button>
        </div>
      </div>
    </div>
  );
}


export default ForgotPasswordDialogue;
