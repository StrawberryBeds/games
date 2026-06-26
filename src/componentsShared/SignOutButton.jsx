import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function SignOutButton(onClick) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (onClick) onClick(); // Close the menu
      navigate('/');

      console.log("User signed out successfully.");
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  return currentUser ? (
    <button onClick={handleSignOut}>{t('sign_out_button')}</button>
  ) : null;
}

export default SignOutButton;
