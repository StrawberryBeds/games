// src/pages/PlayCardSet.jsx
import { useAuth } from "../context/authContext";
import { useParams } from "react-router-dom";
import GameBoard from "../componentsPlayCardSet/GameBoard";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../firebase';


function PlayCardSet() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();

  if (!currentUser) {
    navigate("/signin");
    return null;
  }

  // Define card sets with absolute paths
  const cardSets = [
    {
      id: "0",
      name: "Emojis",
      image: "/assets/cardsets/emojis/smiley_1F60A.svg",
      Cards: [
        {
          cardName: "balloon",
          cardImage: "/assets/cardsets/emojis/balloon_1F388.svg",
        },
        {
          cardName: "cake",
          cardImage: "/assets/cardsets/emojis/cake_1F382.svg",
        },
        { cardName: "cat", cardImage: "/assets/cardsets/emojis/cat_1F431.svg" },
        { cardName: "dog", cardImage: "/assets/cardsets/emojis/dog_1F436.svg" },
        {
          cardName: "dragon",
          cardImage: "/assets/cardsets/emojis/dragon_1F409.svg",
        },
        {
          cardName: "octopus",
          cardImage: "/assets/cardsets/emojis/octopus_1F419.svg",
        },
        {
          cardName: "pheonix",
          cardImage: "/assets/cardsets/emojis/pheonix_1F426-200D-1F525.svg",
        },
        {
          cardName: "rofl",
          cardImage: "/assets/cardsets/emojis/rofl_1F923.svg",
        },
        {
          cardName: "smiley",
          cardImage: "/assets/cardsets/emojis/smiley_1F60A.svg",
        },
        {
          cardName: "unicorn",
          cardImage: "/assets/cardsets/emojis/unicorn_1F984.svg",
        },
      ],
    },
    {
      id: "1",
      name: "Constellations",
      image: "/assets/cardsets/constellations/Carina.svg",
      Cards: [
        {
          cardName: "carina",
          cardImage: "/assets/cardsets/constellations/Carina.svg",
        },
        {
          cardName: "cassiopeia",
          cardImage: "/assets/cardsets/constellations/Cassiopeia.svg",
        },
        {
          cardName: "centaurus",
          cardImage: "/assets/cardsets/constellations/Centaurus.svg",
        },
        {
          cardName: "crux",
          cardImage: "/assets/cardsets/constellations/Crux.svg",
        },
        {
          cardName: "cygnus",
          cardImage: "/assets/cardsets/constellations/Cygnus.svg",
        },
        {
          cardName: "leo",
          cardImage: "/assets/cardsets/constellations/Leo.svg",
        },
        {
          cardName: "orion",
          cardImage: "/assets/cardsets/constellations/Orion.svg",
        },
        {
          cardName: "scorpius",
          cardImage: "/assets/cardsets/constellations/Scorpius.svg",
        },
        {
          cardName: "ursaMajor",
          cardImage: "/assets/cardsets/constellations/UrsaMajor.svg",
        },
        {
          cardName: "ursaMinor",
          cardImage: "/assets/cardsets/constellations/UrsaMinor.svg",
        },
      ],
    },
  ];

  // Find the selected card set
  const selectedSet = cardSets.find((set) => set.id === id);

  if (!selectedSet) {
    return <p>Card set not found</p>;
  }

  // Pass the selected set's Cards to GameBoard
  return <GameBoard cards={selectedSet.Cards} cardSetName={selectedSet.name} />;
}

export default PlayCardSet;
