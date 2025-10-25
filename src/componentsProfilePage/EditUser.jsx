import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { query, where, getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
// import EmailChangeDialogue from "./EmailChangeDialogue";
import PasswordResetDialogue from "./PasswordResetDialogue";
import DeleteAccountDialogue from "./DeleteAccountDialogue";
import { useTranslation } from "react-i18next";

function UserSettings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [displayedUser, setDisplayedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
//   const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          throw new Error(t("user_not_found"));
        }
        const userData = { id: userSnap.id, ...userSnap.data() };
        setDisplayedUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(t("error_loading_user"));
      } finally {
        setLoading(false);
      }
    };
    fetchUserDoc();
  }, [currentUser]);

 if (loading) return <div>{t('loading')}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="settings-container">
      <h2>{t("manageProfiles.settings")}</h2>
      <div className="settings-buttons">
        {/* <button onClick={() => setShowEmailDialog(true)}>Change My Email</button> */}
        <button onClick={() => setShowPasswordDialog(true)}>{t("manageProfiles.change_password_button")}</button>
        <button onClick={() => setShowDeleteDialog(true)}>{t("manageProfiles.delete_account_button")}</button>
      </div>

      {/* Restore this after making a decision about Firebase Cloud Functions   */}
      {/* {showEmailDialog && (<EmailChangeDialogue user={currentUser} onClose={() => setShowEmailDialog(false)}/>)} */}
      
      {showPasswordDialog && (
        <PasswordResetDialogue
          user={currentUser}
          onClose={() => setShowPasswordDialog(false)}
        />
      )}
      {showDeleteDialog && (
        <DeleteAccountDialogue 
        user={currentUser} 
        onClose={() => setShowDeleteDialog(false)}/>
        )}
    </div>
  );
}

export default UserSettings;
