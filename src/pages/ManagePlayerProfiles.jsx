// ManageProfilesPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PlayerTile from '../componentsShared/PlayerTile';
import avatars from '../data/playerAvatars';

// import EditProfile from '../componentsProfilePage/EditProfile';


function ManageProfilesPage({ onComplete }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]);
  const [displayedPlayer, setDisplayedPlayer] = useState(null);
  const [displayedUser, setDisplayedUser] = useState(null)

  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    playerName: "",
    playerAvatar: "",
    playerDOB: ""
  });

  const [userFormData, setUserFormData] = useState({
    userEmail: "",
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

  // Fetch family players
  useEffect(() => {
    const fetchFamilyPlayers = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const parentPlayerRef = doc(db, 'players', currentUser.uid);
        const parentPlayerSnap = await getDoc(parentPlayerRef);
        if (!parentPlayerSnap.exists()) {
          throw new Error("Parent player profile not found!");
        }
        const parentPlayerData = parentPlayerSnap.data();
        const familyId = parentPlayerData.familyId;
        const playersQuery = query(
          collection(db, 'players'),
          where('familyId', '==', familyId)
        );
        const querySnapshot = await getDocs(playersQuery);
        const players = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFamilyPlayers(players);
      } catch (err) {
        console.error("Error fetching family players:", err);
        setError("Failed to load family players. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFamilyPlayers();
  }, [currentUser]);

  const displayPlayerProfile = (player) => {
    console.log("Selected player:", player); // <-- Add this
    setDisplayedPlayer(player);
    setFormData({
      givenName: player.givenName || "",
      familyName: player.familyName || "",
      playerName: player.playerName || "",
      playerAvatar: player.playerAvatar || "",
      playerDOB: player.playerDOB || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarName) => {
    setFormData({ ...formData, playerAvatar: avatarName });
  };

  const handlePlayerSubmit = async (event) => {
    event.preventDefault();
    setError("");
    console.log("Submitting for player 1:", displayedPlayer.playerId);
    console.log("Submitting for player 2:", displayedPlayer.uid);
    if (!displayedPlayer?.playerId) {
      setError("No player selected.");
      return;
    }

    // Add form validation
    try {
      const playerRef = doc(db, "players", displayedPlayer.playerId);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) {
        throw new Error("Player profile not found.");
      }
      await updateDoc(playerRef, {
        ...formData,
      });
      console.log("UpdateDoc", playerRef, formData)

      setSuccess(`${displayedPlayer.playerName}'s profile updated successfully!`);
      if (onComplete) onComplete(true);
    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
  };

  // USER FUNCTIONS

  // Fetch user
  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        // Fetch the user document directly using the uid
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          throw new Error("User not found!");
        }

        // Set the user data to state
        const userData = { id: userSnap.id, ...userSnap.data() };
        setDisplayedUser(userData);

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
    <div className='container'>
      <div className="player-selector">
        <h2>Choose a profile to edit</h2>
        <div className="player-tiles">
          {familyPlayers.map((player) => (
            <PlayerTile
              key={player.id}
              player={player}
              onClick={() => displayPlayerProfile(player)}
              isDisplayedPlayer={displayedPlayer?.id === player.id}
              isDisplayedUser={displayedUser?.id === currentUser.uid}
            />
          ))}
        </div>
      </div>

      <div className='player-data'>
        <form onSubmit={handlePlayerSubmit} className="parent-profile-form">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          {/* Given Name Field */}
          {formData.givenName !== undefined && (
            <div className="form-group">
              <label htmlFor="givenName">Given Name</label>
              <input
                type="text"
                id="givenName"
                name="givenName"
                value={formData.givenName}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {/* Family Name Field */}
          {formData.familyName !== undefined && (
            <div className="form-group">
              <label htmlFor="familyName">Family Name</label>
              <input
                type="text"
                id="familyName"
                name="familyName"
                value={formData.familyName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Player DOB Field */}
          {formData.playerDOB !== undefined && (
            <div className="form-group">
              <label htmlFor="playerDOB">Player Date of Birth</label>
              <input
                type="date"
                id="playerDOB"
                name="playerDOB"
                value={formData.playerDOB}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Player Name Field */}
          {formData.playerName !== undefined && (
            <div className="form-group">
              <label htmlFor="playerName">Player Name</label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {/* Player Avatar Field */}
          <div className="form-group">
            <label>Select Avatar</label>
            <div className="avatar-grid">
              {avatars &&
                Object.values(avatars).map((avatar) => (
                  <div
                    key={avatar.name}
                    className={`avatar-option ${formData.playerAvatar === avatar.name ? "selected" : ""
                      }`}
                    onClick={() => handleAvatarSelect(avatar.name)}
                  >
                    <img src={avatar.image} alt={avatar.name} />
                    <span>{avatar.name}</span>
                  </div>
                ))}
            </div>
          </div>


          {/* Submit Button */}
          <button type="submit"
            className="submit-button"
            disabled={!displayedPlayer}>
            Update {displayedPlayer?.playerName || 'Profile'}
          </button>
        </form>
      </div>


      {displayedPlayer?.isParent && displayedUser && (
        <div className='user-data'>
          <form onSubmit={handleUserSubmit} className="parent-profile-form">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div>
              <label>Change Your Email</label>
              <input
                type="email"
                value={userFormData.userEmail}
                onChange={handleUserChange}
                name="userEmail"
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit"
              className="submit-button"
              disabled={!displayedPlayer}>
              Update Email Address
            </button>

            <button type="reset"
            className="reset-button"
            disabled={!displayedPlayer?.isParent && !displayedUser}>
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageProfilesPage;
