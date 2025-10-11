// src/data/playerAvatars.js

// Import all card images

import balloon from "/assets/cardsets/emojis/balloon_1F388.svg";
import cake from "/assets/cardsets/emojis/cake_1F382.svg";
import cat from "/assets/cardsets/emojis/cat_1F431.svg";
import dog from "/assets/cardsets/emojis/dog_1F436.svg";
import dragon from "/assets/cardsets/emojis/dragon_1F409.svg";

import octopus from "/assets/cardsets/emojis/octopus_1F419.svg";
import pheonix from "/assets/cardsets/emojis/pheonix_1F426-200D-1F525.svg";
import rofl from "/assets/cardsets/emojis/rofl_1F923.svg";
import smiley from "/assets/cardsets/emojis/smiley_1F60A.svg";
import unicorn from "/assets/cardsets/emojis/unicorn_1F984.svg";

// Define avatars outside the component to avoid recreating on every render
const avatars = [
       { id: "0", name: "balloon", image: balloon },
       { id: "1", name: "cake", image: cake },
       { id: "2", name: "cat", image: cat },
       { id: "3", name: "dog", image: dog },
       { id: "4", name: "dragon", image: dragon },
 
       { id: "5", name: "octopus", image: octopus },
       { id: "6", name: "pheonix", image: pheonix },
       { id: "7", name: "rofl", image: rofl },
       { id: "8", name: "smiley", image: smiley },
       { id: "9", name: "unicorn", image: unicorn },
];

export default avatars;
