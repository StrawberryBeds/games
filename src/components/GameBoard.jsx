// src/components/GameBoard.jsx
import React, { useState, useEffect } from "react";
import Card from "./Card";
import Score from "./Score";
import ResetButton from "./ResetButton";
import "./GameBoard.css";

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

function GameBoard({ cards: initialCards }) {
  // Map string paths to imported images
  const imageMap = {
    "../assets/emojis/balloon_1F388.svg": balloon,
    "../assets/emojis/cake_1F382.svg": cake,
    "../assets/emojis/cat_1F431.svg": cat,
    "../assets/emojis/dog_1F436.svg": dog,
    "../assets/emojis/dragon_1F409.svg": dragon,
    "../assets/cardsets/emojis/octopus_1F419.svg": octopus,
    "../assets/emojis/pheonix_1F426-200D-1F525.svg": pheonix,
    "../assets/emojis/rofl_1F923.svg": rofl,
    "../assets/emojis/smiley_1F60A.svg": smiley,
    "../assets/emojis/unicorn_1F984.svg": unicorn,

    "../assets/cardsets/constellations/Carina.svg": carina,
    "../assets/cardsets/constellations/Cassiopeia.svg": cassiopeia,
    "../assets/cardsets/constellations/Centaurus.svg": centaurus,
    "../assets/cardsets/constellations/Crux.svg": crux,
    "../assets/cardsets/constellations/Cygnus.svg": cygnus,
    "../assets/cardsets/constellations/Leo.svg": leo,
    "../assets/cardsets/constellations/Orion.svg": orion,
    "../assets/cardsets/constellations/Scorpius.svg": scorpius,
    "../assets/cardsets/constellations/UrsaMajor.svg": ursaMajor,
    "../assets/cardsets/constellations/UrsaMinor.svg": ursaMinor,
  };

  // Replace string paths with imported images
  const cardsWithImages = initialCards.map((card) => ({
    ...card,
    cardImage: imageMap[card.cardImage],
  }));

  const [cards, setCards] = useState(shuffleCards(cardsWithImages));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);

  function shuffleCards(cardList) {
    const duplicatedCards = [...cardList, ...cardList]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        cardName: card.cardName,
        cardImage: card.cardImage,
      }));
    return duplicatedCards;
  }

  const handleCardClick = (id) => {
    if (flippedIndices.includes(id) || solvedIndices.includes(id)) {
      return;
    }
    setFlippedIndices((prevFlippedIndices) => [...prevFlippedIndices, id]);
    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      const firstCard = cards.find((card) => card.id === firstIndex);
      const clickedCard = cards.find((card) => card.id === id);
      setTurns((prevTurns) => prevTurns + 1);
      if (firstCard.cardName === clickedCard.cardName) {
        setSolvedIndices((prevSolvedIndices) => [
          ...prevSolvedIndices,
          firstIndex,
          id,
        ]);
        setMatches((prevMatches) => prevMatches + 1);
      }
      setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (solvedIndices.length === cards.length) {
      alert("Well done! Take a moment to admire your skill and get well soon!");
    }
  }, [solvedIndices, cards.length]);

  const handleReset = () => {
    setCards(shuffleCards(cardsWithImages));
    setFlippedIndices([]);
    setSolvedIndices([]);
    setTurns(0);
    setMatches(0);
  };

  return (
    <div className="game-container">
      <Score matches={matches} turns={turns} />
      <ResetButton onClick={handleReset} />
      <div className="game-board">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            image={card.cardImage}
            isFlipped={
              flippedIndices.includes(card.id) ||
              solvedIndices.includes(card.id)
            }
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
