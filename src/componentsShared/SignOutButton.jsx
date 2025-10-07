import { signOut } from 'firebase/auth';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';


function SignOutButton() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      console.log("User signed out successfully.");
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  return currentUser ? (
    <button onClick={handleSignOut}>Sign Out</button>
  ) : null;
}

export default SignOutButton;
