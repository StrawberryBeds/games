// src/utils/usernameGenerator.js
import wordLists from '../data/usernameWordLists.json';

/**
 * Generates a random username from adjective + noun
 * @returns {string} - e.g., "Swift Dragon"
 */
export function generateUsername() {
  const adjective = wordLists.adjectives[Math.floor(Math.random() * wordLists.adjectives.length)];
  const noun = wordLists.nouns[Math.floor(Math.random() * wordLists.nouns.length)];
  
  // Capitalize first letter of each word
  const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
  const capitalizedNoun = noun.charAt(0).toUpperCase() + noun.slice(1);
  
  return `${capitalizedAdjective} ${capitalizedNoun}`;
}

/**
 * Generates 3 unique random usernames
 * @returns {string[]} - Array of 3 unique usernames
 */
export function generateUsernameOptions() {
  const options = new Set();
  
  while (options.size < 3) {
    options.add(generateUsername());
  }
  
  return Array.from(options);
}

/**
 * Gets the stored guest username from localStorage
 * @returns {string|null} - The stored username or null
 */
export function getStoredGuestUsername() {
  return localStorage.getItem('guestUsername');
}

/**
 * Stores the guest username in localStorage
 * @param {string} username - The username to store
 */
export function setStoredGuestUsername(username) {
  localStorage.setItem('guestUsername', username);
}

/**
 * Clears the stored guest username (e.g., when user signs up)
 */
export function clearStoredGuestUsername() {
  localStorage.removeItem('guestUsername');
  localStorage.removeItem('guestPersonalBest');
  localStorage.removeItem('guestGamesPlayed');
}