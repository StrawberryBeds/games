import React from "react";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';

function EmailChangeDialogue({ onClose }) {
  const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [userFormData, setUserFormData] = useState({
    email: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

    // Redirect if not logged in or no player selected
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // USER FUNCTIONS

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

  if (!currentUser?.uid) {
    setError("No user selected.");
    return;
  }

  // Validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail(userFormData.email)) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    // Reauthenticate the user
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      prompt("Please enter your current password for verification:")
    );
    await reauthenticateWithCredential(currentUser, credential);

    // Update email in Firebase Auth
    if (userFormData.email !== currentUser.email) {
      await updateEmail(currentUser, userFormData.email);
      await sendEmailVerification(currentUser);
      console.log("Email sent to:", userFormData.email);
      setSuccess("Verification email sent to your new address. Please verify to complete the change.");
    }

    // Update other user data in Firestore
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      email: userFormData.email,
    });
  } catch (error) {
    console.error("Full error:", error);
    if (error.code === "auth/email-already-in-use") {
      setError("The email address is already in use by another account.");
    } else if (error.code === "auth/wrong-password") {
      setError("Incorrect password. Please try again.");
    } else {
      setError(error.message);
    }
    setSuccess("");
  }
};

    return (
      <div className="user-data">
        <h2>Email Change Dialogue</h2>
<div className='user-data'>
          <form onSubmit={handleUserSubmit} className="parent-profile-form">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div>
              <label>Change Your Email</label>
              <input
                type="email"
                value={userFormData.email}
                onChange={handleUserChange}
                name="email"
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit"
              className="submit-button">
              Update Email Address
            </button>
          </form>
      </div>
      </div>
    );
  }


export default EmailChangeDialogue;


