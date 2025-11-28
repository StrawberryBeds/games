import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { query, where, getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
// import EmailChangeDialogue from "./EmailChangeDialogue";
import ChangePasswordDialogue from "./ChangePasswordDialogue";
import DeleteAccountDialogue from "./DeleteAccountDialogue";
import { useTranslation } from "react-i18next";

function UserSettings() {
  const { currentUser } = useAuth();
  const [emailConsent, setEmailConsent] = useState(false);
  const navigate = useNavigate();
  const [displayedUser, setDisplayedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      <h3>{t("manageProfiles.email_consent")}: {displayedUser && displayedUser.emailConsent ? t("manageProfiles.consent_given") : t("manageProfiles.consent_not_given")}</h3>
                          <div>
          <label>
            <input
              type="checkbox"
              checked={emailConsent}
              onChange={(e) => setEmailConsent(e.target.checked)}
              name="emailConsent"
            />
            {t('signUp.email_consent')}
          </label>
        </div>
      
      
      <div className="settings-buttons">
        {/* <button onClick={() => setShowEmailDialog(true)}>Change My Email</button> */}
        <button onClick ={() => {
          // Update email consent in Firestore
          const updateEmailConsent = async () => {
            if (!currentUser) return;
            try {
              const userRef = doc(db, 'users', currentUser.uid);
              await updateDoc(userRef, { emailConsent: emailConsent });
              setDisplayedUser((prev) => ({ ...prev, emailConsent: emailConsent }));
            } catch (err) {
              console.error("Error updating email consent:", err);
              setError(t("error_updating_consent"));
            }
          };
          updateEmailConsent();
        }}>{t("manageProfiles.update_email_consent_button")}</button>
        <button onClick={() => setShowPasswordDialog(true)}>{t("manageProfiles.change_password_button")}</button>
        <button onClick={() => setShowDeleteDialog(true)}>{t("manageProfiles.delete_account_button")}</button>
      </div>

      {/* Restore this after making a decision about Firebase Cloud Functions   */}
      {/* {showEmailDialog && (<EmailChangeDialogue user={currentUser} onClose={() => setShowEmailDialog(false)}/>)} */}


      {showPasswordDialog && (
        <ChangePasswordDialogue
          user={currentUser}
          onClose={() => setShowPasswordDialog(false)}
        />
      )}
      {showDeleteDialog && (
        <DeleteAccountDialogue
          user={currentUser}
          onClose={() => setShowDeleteDialog(false)} />
      )}
    </div>
  );
}

export default UserSettings;
