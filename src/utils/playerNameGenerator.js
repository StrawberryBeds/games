// src/utils/playerNameGenerator.js
import wordLists from '../data/playerNameWordlists.json';

/**
 * Generates a random playerName from adjective + noun
 * @returns {string} - e.g., "Swift Dragon"
 */
export function generatePlayerName() {
  const adjective = wordLists.adjectives[Math.floor(Math.random() * wordLists.adjectives.length)];
  const noun = wordLists.nouns[Math.floor(Math.random() * wordLists.nouns.length)];
  
  // Capitalize first letter of each word
  const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
  const capitalizedNoun = noun.charAt(0).toUpperCase() + noun.slice(1);
  
  return `${capitalizedAdjective} ${capitalizedNoun}`;
}

/**
 * Generates 3 unique random playerNames
 * @returns {string[]} - Array of 3 unique playerNames
 */
export function generatePlayerNameOptions() {
  const options = new Set();
  
  while (options.size < 3) {
    options.add(generatePlayerName());
  }
  
  return Array.from(options);
}

/**
 * Gets the stored guest playerName from localStorage
 * @returns {string|null} - The stored playerName or null
 */
export function getStoredGuestPlayerName() {
  return localStorage.getItem('guestPlayerName');
}

/**
 * Stores the guest playerName in localStorage
 * @param {string} playerName - The playerName to store
 */
export function setStoredGuestPlayerName(playerName) {
  localStorage.setItem('guestPlayerName', playerName);
}

/**
 * Clears the stored guest playerName (e.g., when user signs up)
 */
export function clearStoredGuestPlayerName() {
  localStorage.removeItem('guestPlayerName');
  localStorage.removeItem('guestPersonalBest');
  localStorage.removeItem('guestGamesPlayed');
}