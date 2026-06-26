// pages/ParentAuth.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlayerSelection } from '../context/usePlayerSelection';
import { useAuth } from '../context/authContext';
import { useNavigate, useLocation } from 'react-router-dom';

function ParentAuthPage() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { setRequiresParentAuth } = usePlayerSelection();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading)
    return <div>{t("loading")}</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError(t("parentAuth.error_enter_password"));
      return;
    }
    if (!currentUser) {
      setError(t("parentAuth.error_no_user"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      setRequiresParentAuth(false);
      navigate(location.state?.from?.pathname || '/auth/manageprofiles');
    } catch (err) {
      console.error("Reauthentication error:", err);
      setError(t("incorrect_password"));
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="page-wrapper">
   
      <form onSubmit={handleSubmit}>
         <div className="parent-auth">
      <h2>{t("parentAuth.parent_verification")}</h2>
      <p>{t("parentAuth.enter_password")}</p>
      {error && <p className="error">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('password')} // Assuming you have this key
          required
        />
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? t("parentAuth.verifying_message") : t("parentAuth.continue_button")}
          </button>
          <button type="button" onClick={() => navigate(-1)}>{t("cancel")}</button> {/* Assuming you have a "cancel" key */}
        </div>
              </div>
      </form>
    </div>

  );

}

export default ParentAuthPage;
