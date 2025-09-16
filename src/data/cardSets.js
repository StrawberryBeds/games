// src/data/cardSets.js

// Import all card images

import balloon from "../assets/cardsets/emojis/balloon_1F388.svg";
import cake from "../assets/cardsets/emojis/cake_1F382.svg";
import cat from "../assets/cardsets/emojis/cat_1F431.svg";
import dog from "../assets/cardsets/emojis/dog_1F436.svg";
import dragon from "../assets/cardsets/emojis/dragon_1F409.svg";

import octopus from "../assets/cardsets/emojis/octopus_1F419.svg";
import pheonix from "../assets/cardsets/emojis/pheonix_1F426-200D-1F525.svg";
import rofl from "../assets/cardsets/emojis/rofl_1F923.svg";
import smiley from "../assets/cardsets/emojis/smiley_1F60A.svg";
import unicorn from "../assets/cardsets/emojis/unicorn_1F984.svg";

import carina from "../assets/cardsets/constellations/Carina.svg";
import cassiopeia from "../assets/cardsets/constellations/Cassiopeia.svg";
import centaurus from "../assets/cardsets/constellations/Centaurus.svg";
import crux from "../assets/cardsets/constellations/Crux.svg";
import cygnus from "../assets/cardsets/constellations/Cygnus.svg";

import leo from "../assets/cardsets/constellations/Leo.svg";
import orion from "../assets/cardsets/constellations/Orion.svg";
import scorpius from "../assets/cardsets/constellations/Scorpius.svg";
import ursaMajor from "../assets/cardsets/constellations/UrsaMajor.svg";
import ursaMinor from "../assets/cardsets/constellations/UrsaMinor.svg";

// Define card sets
const cardSets = [
  {
    id: "0",
    name: "Emojis",
    image: smiley,
    Cards: [
      { cardName: "balloon", cardImage: balloon },
      { cardName: "cake", cardImage: cake },
      { cardName: "cat", cardImage: cat },
      { cardName: "dog", cardImage: dog },
      { cardName: "dragon", cardImage: dragon },

      { cardName: "octopus", cardImage: octopus },
      { cardName: "pheonix", cardImage: pheonix },
      { cardName: "rofl", cardImage: rofl },
      { cardName: "smiley", cardImage: smiley },
      { cardName: "unicorn", cardImage: unicorn },
    ],
  },
  {
    id: "1",
    name: "Constellations",
    image: carina,
    Cards: [
      { cardName: "carina", cardImage: carina },
      { cardName: "cassiopeia", cardImage: cassiopeia },
      { cardName: "centaurus", cardImage: centaurus },
      { cardName: "crux", cardImage: crux },
      { cardName: "cygnus", cardImage: cygnus },
      { cardName: "leo", cardImage: leo },
      { cardName: "orion", cardImage: orion },
      { cardName: "scorpius", cardImage: scorpius },
      { cardName: "ursaMajor", cardImage: ursaMajor },
      { cardName: "ursaMinor", cardImage: ursaMinor },
    ],
  },
];

export default cardSets;
