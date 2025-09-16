import { useParams } from 'react-router-dom';
import GameBoard from '../components/GameBoard';

import smiley from "../assets/cardsets/emojis/smiley_1F60A.svg";
import carina from "../assets/cardsets/constellations/Carina.svg";


function PlayCardSet() {
  const { id } = useParams();

  // Hardcoded card sets data (matching CardSetSelection)
  const cardSets = [
    {
      id: "0",
      image: smiley,
      Cards: [
        { cardName: "balloon", cardImage: "../assets/emojis/balloon_1F388.svg" },
        { cardName: "cake", cardImage: "../assets/emojis/cake_1F382.svg" },
        { cardName: "cat", cardImage: "../assets/emojis/cat_1F431.svg" },
        { cardName: "dog", cardImage: "../assets/emojis/dog_1F436.svg" },
        { cardName: "dragon", cardImage: "../assets/emojis/dragon_1F409.svg" },
        { cardName: "pheonix", cardImage: "../assets/emojis/pheonix_1F426-200D-1F525.svg" },
        { cardName: "rofl", cardImage: "../assets/emojis/rofl_1F923.svg" },
        { cardName: "smiley", cardImage: "../assets/emojis/smiley_1F60A.svg" },
        { cardName: "unicorn", cardImage: "../assets/emojis/unicorn_1F984.svg" },
      ],
    },
    {
        id: "1",
        image: carina,
        Cards: [
        { cardName: "carina", cardImage: "../assets/cardsets/constellations/Carina.svg"},
        { cardName: "cassiopeia", cardImage: "../assets/cardsets/constellations/Cassiopeia.svg"},
        { cardName: "centaurus", cardImage: "../assets/cardsets/constellations/Centaurus.svg"},
        { cardName: "crux", cardImage: "../assets/cardsets/constellations/Crux.svg"},
        { cardName: "cygnus", cardImage: "../assets/cardsets/constellations/Cygnus.svg"},

        { cardName: "cygnus", cardImage: "../assets/cardsets/constellations/Leo.svg"},
        { cardName: "cygnus", cardImage: "../assets/cardsets/constellations/Orion.svg"},
        { cardName: "cygnus", cardImage: "../assets/cardsets/constellations/Scorpius.svg"},
        { cardName: "cygnus", cardImage: "../assets/cardsets/constellations/UrsaMajor.svg"},
        { cardName: "cygnus", cardImage: "../assets/cardsets/constellations/UrsaMinor.svg"},
    ]
    }
  ];

  // Find the selected card set
  const selectedSet = cardSets.find((set) => set.id === id);

  if (!selectedSet) {
    return <p>Card set not found</p>;
  }

  // Pass the selected set's Cards to GameBoard
  return <GameBoard cards={selectedSet.Cards} />;
}

export default PlayCardSet;
