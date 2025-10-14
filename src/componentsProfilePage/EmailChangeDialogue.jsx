import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';

function EmailChangeDialogue({ onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userFormData, setUserFormData] = useState({ email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const modalRef = useRef();

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Fetch user
  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!currentUser?.uid) {
        console.error("No current user or UID available.");
        return;
      }
      try {
        setLoading(true);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          throw new Error("User not found!");
        }
        const userData = { id: userSnap.id, ...userSnap.data() };
        setUser(userData);
        setUserFormData({ email: userData.email });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDoc();
  }, [currentUser]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleUserSubmit = async (event) => {
  event.preventDefault();
  setError("");
  try {
    // Reauthenticate the user
    const password = prompt("Please enter your current password for verification:");
    if (!password) {
      setError("Password is required for verification.");
      return;
    }
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );
    await reauthenticateWithCredential(currentUser, credential);

    // Try updating the email
    await updateEmail(currentUser, userFormData.email);

    // If successful, send verification email
    await sendEmailVerification(currentUser);
    setSuccess("Verification email sent to your new address. Please verify to complete the change.");
  } catch (error) {
    console.error("Full error:", error);
    if (error.code === "auth/operation-not-allowed") {
      setError("Email changes are not allowed. Check Firebase Authentication settings.");
    } else if (error.code === "auth/email-already-in-use") {
      setError("The email address is already in use by another account.");
    } else if (error.code === "auth/wrong-password") {
      setError("Incorrect password. Please try again.");
    } else {
      setError(error.message);
    }
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Change Email Address</h2>
        <div className='user-data'>
          <form onSubmit={handleUserSubmit} className="parent-profile-form">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div>
              <label>New Email Address</label>
              <input
                type="email"
                value={userFormData.email}
                onChange={handleUserChange}
                name="email"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Update Email Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmailChangeDialogue;
