// ProfilePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { usePlayerSelection } from "../context/usePlayerSelection";
import {
  query,
  where,
  getDocs,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function ProfilePage() {
  const { currentUser } = useAuth();
  const { currentPlayer, setRequiresParentAuth } = usePlayerSelection();
  const navigate = useNavigate();
  const [familyPlayers, setFamilyPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not logged in or no player selected
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  console.log("ProfilePage:", currentPlayer);

  // Fetch family players
  useEffect(() => {
    const fetchFamilyPlayers = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const parentPlayerRef = doc(db, "players", currentUser.uid);
        const parentPlayerSnap = await getDoc(parentPlayerRef);
        if (!parentPlayerSnap.exists()) {
          throw new Error("Parent player profile not found!");
        }
        const parentPlayerData = parentPlayerSnap.data();
        const familyId = parentPlayerData.familyId;
        const playersQuery = query(
          collection(db, "players"),
          where("familyId", "==", familyId)
        );
        const querySnapshot = await getDocs(playersQuery);
        const players = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

  // Handle "Edit Profiles" button click
  const handleEditProfiles = () => {
    if (!currentPlayer) {
      alert("No player selected!");
      return;
    }
    if (currentPlayer.isParent) {
      setRequiresParentAuth(true); // Trigger parent auth
      navigate("/parent-auth"); // Redirect to password prompt
    } else {
      alert("Only parents can manage profiles.");
    }
  };

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-page">
      <h2>Your Family Profiles</h2>
      <button onClick={handleEditProfiles}>Edit Profiles</button>
      <div className="player-tiles">
        {familyPlayers.map((player) => (
          <div key={player.id} className="player-tile">
            <h3>{player.playerName}</h3>
            <p>Avatar: {player.playerAvatar}</p>
            <p>DOB: {player.playerDOB}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
