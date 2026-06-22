// src/data/slideSets.js

// Import slide puzzle images (full images to be divided into 9 tiles)
import mallard from "/assets/cardsets/birds/mallard.svg";

// Define slide sets
// Each set contains a single image that will be divided into a 3x3 grid (9 tiles)
const slideSets = [
  {
    id: "0",
    nameKey: "birds",
    image: mallard,
    tileImage: mallard,
  }
];

export default slideSets;
