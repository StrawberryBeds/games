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
  const [loading, setLoading] = useState(true);
  const [displayedPlayer, setDisplayedPlayer] = useState([]);


  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    playerName: "",
    playerAvatar: "",
    playerDOB: ""
  });

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
    setDisplayedPlayer(player);
    setFormData(player)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData({ ...formData, playerAvatar: avatarId });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validate all fields
    if (Object.values(formData).some((field) => !field)) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const familyId = uuidv4();
      await updateDoc(doc(db, "players", displayedPlayer.uid), {
        ...formData,
      });
      setSuccess("Parent profile updated successfully!");
      if (onComplete) onComplete(true);
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
            />
          ))}
        </div>
      </div>

      <div className='player-data'>

        <form onSubmit={handleSubmit} className="parent-profile-form">
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
              <label htmlFor="playerDOB">Player Dob</label>
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
             {avatars && Array.isArray(avatars) && avatars.map((avatar) => (
  <div
    key={avatar.id}
    className={`avatar-option ${formData.playerAvatar === avatar.id ? "selected" : ""}`}
    onClick={() => handleAvatarSelect(avatar.id)}
  >
    <img src={avatar.image} alt={avatar.name} />
    <span>{avatar.name}</span>
  </div>
))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Update Parent Profile
          </button>
        </form>
      </div>


    </div>
  );
}

export default ManageProfilesPage;
