import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuth } from "../context/authContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import avatars from '../data/playerAvatars';

function EditUser({ player, avatars, onComplete }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [displayedUser, setDisplayedUser] = useState(null)
    const [userFormData, setUserFormData] = useState({
        email: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
        }
    }, [currentUser, navigate]);

    // Populate form data when the player prop changes
    useEffect(() => {
        if (currentUser) {
            setUserFormData({
                email: currentUser.email || "",
            });
        }
    }, [currentUser]);



    // Fetch currentUser
    useEffect(() => {
        const fetchUserDoc = async () => {
            if (!currentUser) return;
            try {
                setLoading(true);
                // Fetch the currentUser document directly using the uid
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    throw new Error("User not found!");
                }

                // Set the currentUser data to state
                const userData = { id: userSnap.id, ...userSnap.data() };
                setDisplayedUser(userData);

            } catch (err) {
                console.error("Error fetching currentUser:", err);
                setError("Failed to load currentUser. Please try again.");
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
        try {
            // Update email in Firebase Auth
            if (formData.userEmail && formData.userEmail !== displayedUser.email) {
                await updateEmail(currentUser, formData.userEmail);
                await sendEmailVerification(currentUser);
                setSuccess("Verification email sent to your new address. Please verify to complete the change.");
            }
            // Update other user data in Firestore (e.g., modifiedAt)
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                email: formData.userEmail,
                modifiedAt: new Date(),
            });
        } catch (error) {
            setError(error.message);
            setSuccess("");
        }
    };


    if (loading) return <div>Loading players...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="modal">
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

export default EditUser;
