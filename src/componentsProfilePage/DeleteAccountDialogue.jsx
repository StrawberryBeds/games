import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function DeleteAccountDialogue({ onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { t } = useTranslation();

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      setError(t('user_not_found'));
      return;
    }
    setShowPasswordModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!password) {
      setError(t("password_required"));
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
          <h2>{t("manageProfiles.delete_account")}</h2>
          <p>
            {t("manageProfiles.delete_account_warning")}
          </p>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="modal-buttons">
            <button onClick={onClose} disabled={isLoading}>
              {t("cancel")}
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="delete-button"
            >
              {isLoading ? t("manageProfiles.delete_preparing") : t("manageProfiles.delete_button")}
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
            ×
          </button>
          <h2>{t("manageProfiles.confirm_delete")}</h2>
          <p>{t("manageProfiles.enter_password")}</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button onClick={() => setShowPasswordModal(false)} disabled={isLoading}>
              {t("cancel")}
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="delete-button"
            >
              {isLoading ? t("manageProfiles.deleting") : t("manageProfiles.confirm_delete_button")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccountDialogue;
