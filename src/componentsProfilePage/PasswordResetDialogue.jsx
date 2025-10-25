import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useTranslation } from "react-i18next";

function PasswordResetDialogue({ onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <h2>{t("manageProfiles.password_reset")}</h2>
        <form onSubmit={handleSubmit}>
          <label>{t("manageProfiles.enter_email_for_password_reset")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="note">{t("manageProfiles.password_reset_note")}</p>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit">{t("manageProfiles.send_reset_link")}</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordResetDialogue;
