// src/utils/globalLeaderboardHelpers.js

/**
 * Gets the current month identifier (e.g., "2024-12")
 * @returns {string}
 */
export function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Saves or updates a guest player's score to the global leaderboard
 * @param {string} playerName - The player's chosen playerName
 * @param {number} score - The number of turns taken
 * @param {string} cardSet - The card set name
 * @returns {Promise<{rank: number, isPersonalBest: boolean}>}
 */
export async function saveGlobalScore(playerName, score, cardSet) {
  try {
    const month = getCurrentMonth();
    const leaderboardRef = doc(db, 'globalLeaderboard', playerName);
    
    // Safety check for cardSet
    if (!cardSet) {
      console.warn('cardSet is undefined, using default');
      cardSet = 'default';
    }
    
    // Check if player already exists
    const existingDoc = await getDoc(leaderboardRef);
    
    let isPersonalBest = false;
    let gamesPlayed = 1;
    let bestScore = score;
    
    if (existingDoc.exists()) {
      const existingData = existingDoc.data();
      gamesPlayed = (existingData.gamesPlayed || 0) + 1;
      bestScore = Math.min(existingData.score, score);
      isPersonalBest = score < existingData.score;
    } else {
      isPersonalBest = true; // First game is always personal best
    }
    
    // Save/update the document
    await setDoc(leaderboardRef, {
      playerName,
      score: bestScore,
      lastPlayed: Timestamp.now(),
      month,
      cardSet,
      gamesPlayed
    });
    
    // Get the player's rank
    const rank = await getPlayerRank(playerName, month);
    
    // Store in localStorage for quick access
    localStorage.setItem('guestPersonalBest', bestScore.toString());
    localStorage.setItem('guestGamesPlayed', gamesPlayed.toString());
    
    return { rank, isPersonalBest, bestScore };
  } catch (error) {
    console.error('Error saving global score:', error);
    throw error;
  }
}

/**
 * Gets a player's rank on the global leaderboard
 * @param {string} playerName - The player's username
 * @param {string} month - The month identifier
 * @returns {Promise<number>} - The player's rank (1-indexed)
 */
export async function getPlayerRank(playerName, month) {
  try {
    const leaderboardRef = collection(db, 'globalLeaderboard');
    const q = query(
      leaderboardRef,
      where('month', '==', month),
      orderBy('score', 'asc'),
      orderBy('lastPlayed', 'desc')
    );
    
    const snapshot = await getDocs(q);
    let rank = 1;
    
    for (const doc of snapshot.docs) {
      if (doc.id === playerName) {
        return rank;
      }
      rank++;
    }
    
    return rank;
  } catch (error) {
    console.error('Error getting player rank:', error);
    return null;
  }
}

/**
 * Gets the top players from the global leaderboard
 * @param {number} topN - Number of top positions to retrieve (default: 20)
 * @returns {Promise<Array>} - Array of {playerName, score, lastPlayed, rank, tiedCount}
 */
export async function getGlobalLeaderboard(topN = 20) {
  try {
    const month = getCurrentMonth();
    const leaderboardRef = collection(db, 'globalLeaderboard');
    const q = query(
      leaderboardRef,
      where('month', '==', month),
      orderBy('score', 'asc'),
      orderBy('lastPlayed', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const allPlayers = snapshot.docs.map(doc => ({
      playerName: doc.id,
      ...doc.data()
    }));
    
    // Group by score to handle ties
    const leaderboard = [];
    let currentRank = 1;
    let currentScore = null;
    let playersAtCurrentScore = [];
    
    for (const player of allPlayers) {
      if (player.score !== currentScore) {
        // Push previous score group if exists
        if (playersAtCurrentScore.length > 0) {
          leaderboard.push({
            rank: currentRank,
            score: currentScore,
            players: playersAtCurrentScore,
            tiedCount: playersAtCurrentScore.length
          });
          currentRank += playersAtCurrentScore.length;
        }
        
        // Start new score group
        currentScore = player.score;
        playersAtCurrentScore = [player];
      } else {
        playersAtCurrentScore.push(player);
      }
      
      // Stop if we've filled top N positions
      if (currentRank > topN) break;
    }
    
    // Add final group
    if (playersAtCurrentScore.length > 0 && currentRank <= topN) {
      leaderboard.push({
        rank: currentRank,
        score: currentScore,
        players: playersAtCurrentScore,
        tiedCount: playersAtCurrentScore.length
      });
    }
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    return [];
  }
}

/**
 * Gets the average score for the current month
 * @returns {Promise<number|null>}
 */
export async function getAverageScore() {
  try {
    const month = getCurrentMonth();
    const leaderboardRef = collection(db, 'globalLeaderboard');
    const q = query(
      leaderboardRef,
      where('month', '==', month)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const total = snapshot.docs.reduce((sum, doc) => sum + doc.data().score, 0);
    return total / snapshot.size;
  } catch (error) {
    console.error('Error calculating average score:', error);
    return null;
  }
}

/**
 * Checks if a cardSet is the monthly global leaderboard cardSet
 * @param {string} cardSetNameKey - The nameKey of the cardSet (e.g., "christmas")
 * @param {string} monthlyCardSetKey - The nameKey of the current monthly cardSet
 * @returns {boolean}
 */
export function isMonthlyCardSet(cardSetNameKey, monthlyCardSetKey) {
  return cardSetNameKey === monthlyCardSetKey;
}