// src/pages/Home.jsx
import CardSetSelection from "../components/CardSetSelection";
import { useAuth } from "../context/authContext";
import { usePlayerSelection } from "../context/usePlayerSelection";
import { useNavigate } from "react-router-dom";

function Home() {
  const { currentUser } = useAuth();
  const { currentPlayer } = usePlayerSelection();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate("/signin");
    return null;
  }

  console.log("Home:", currentPlayer);

  return (
    <>
      <CardSetSelection></CardSetSelection>
    </>
  );
}

export default Home;
