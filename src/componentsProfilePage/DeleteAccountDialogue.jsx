import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { auth, db } from "../firebase";
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  doc,
  deleteDoc,
  query,
  where,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function DeleteAccountDialogue({ onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      setError("No user is signed in.");
      return;
    }

    setShowPasswordModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!password) {
      setError("Password is required to delete your account.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);

      // 2. Delete all child players (all players with the same familyId)
      const parentPlayerRef = doc(db, "players", currentUser.uid);
      const parentPlayerSnap = await getDoc(parentPlayerRef);

      if (parentPlayerSnap.exists()) {
        const familyId = parentPlayerSnap.data().familyId;
        const playersQuery = query(
          collection(db, "players"),
          where("familyId", "==", familyId)
        );
        const playersSnapshot = await getDocs(playersQuery);

        // Delete each player in the family
        const deletePromises = playersSnapshot.docs.map((playerDoc) =>
          deleteDoc(doc(db, "players", playerDoc.id))
        );
        await Promise.all(deletePromises);
      }

      // 3. Delete the user document from Firestore
      await deleteDoc(doc(db, "users", currentUser.uid));

      // 4. Delete the user from Firebase Authentication
      await deleteUser(currentUser);

      // 5. Redirect to the sign-in page
      navigate("/signin");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      {!showPasswordModal ? (
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          <h2>Delete Account</h2>
          <p>
            Are you sure you want to delete your account? This action is
            irreversible and will delete all associated data.
          </p>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="modal-buttons">
            <button onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="delete-button"
            >
              {isLoading ? "Preparing..." : "Delete Account"}
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
            ×
          </button>
          <h2>Confirm Deletion</h2>
          <p>For security, please enter your password to confirm account deletion:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button onClick={() => setShowPasswordModal(false)} disabled={isLoading}>
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="delete-button"
            >
              {isLoading ? "Deleting..." : "Confirm Deletion"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccountDialogue;
