// src/utils/slideGameUtils.js

/**
 * Initialize slide grid with 9 numbered tiles (0-8) and 1 empty space (represented as 9)
 * Returns an array of 10 elements where each tile knows its original ID
 */
export function initializeSlideGrid() {
  const tiles = [];
  for (let i = 0; i < 9; i++) {
    tiles.push({ id: i, isEmpty: false });
  }
  tiles.push({ id: 9, isEmpty: true }); // Empty space
  return tiles;
}

/**
 * Get the position (row, col) of an index in a 3x3 grid
 */
function getPosition(index) {
  return {
    row: Math.floor(index / 3),
    col: index % 3,
  };
}

/**
 * Get the index from a position (row, col) in a 3x3 grid
 */
function getIndex(row, col) {
  return row * 3 + col;
}

/**
 * Check if a tile at tileIndex is adjacent to the empty space
 */
export function isAdjacentToEmpty(tiles, tileIndex) {
  // Find empty space index
  const emptyIndex = tiles.findIndex(tile => tile.isEmpty);
  
  const tilePos = getPosition(tileIndex);
  const emptyPos = getPosition(emptyIndex);
  
  // Check if tiles are orthogonally adjacent (not diagonal)
  const rowDiff = Math.abs(tilePos.row - emptyPos.row);
  const colDiff = Math.abs(tilePos.col - emptyPos.col);
  
  return (rowDiff + colDiff) === 1; // Manhattan distance of 1
}

/**
 * Slide a tile into the empty space
 * Returns a new tiles array with the swap performed
 */
export function slideTile(tiles, tileIndex) {
  if (!isAdjacentToEmpty(tiles, tileIndex)) {
    return tiles; // Invalid move, return unchanged
  }
  
  const newTiles = [...tiles];
  const emptyIndex = newTiles.findIndex(tile => tile.isEmpty);
  
  // Swap tiles
  [newTiles[emptyIndex], newTiles[tileIndex]] = [newTiles[tileIndex], newTiles[emptyIndex]];
  
  return newTiles;
}

/**
 * Shuffle the grid by making random valid moves
 * This ensures the grid is always solvable
 */
export function shuffleSlideGrid(tiles, shuffleCount = 100) {
  let currentTiles = [...tiles];
  
  for (let i = 0; i < shuffleCount; i++) {
    const emptyIndex = currentTiles.findIndex(tile => tile.isEmpty);
    
    // Find all adjacent tiles that can be moved into the empty space
    const adjacentTiles = [];
    const emptyPos = getPosition(emptyIndex);
    
    // Check all 4 cardinal directions
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 },  // right
    ];
    
    directions.forEach(dir => {
      const newRow = emptyPos.row + dir.row;
      const newCol = emptyPos.col + dir.col;
      
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        const adjacentIndex = getIndex(newRow, newCol);
        adjacentTiles.push(adjacentIndex);
      }
    });
    
    // Pick a random adjacent tile and slide it
    const randomTile = adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)];
    currentTiles = slideTile(currentTiles, randomTile);
  }
  
  return currentTiles;
}

/**
 * Check if the current grid matches the original (solved state)
 * Solved state is when tiles are in their original order (0-8) with empty at the end (9)
 */
export function isGridSolved(currentTiles) {
  for (let i = 0; i < 10; i++) {
    if (currentTiles[i].id !== i) {
      return false;
    }
  }
  return true;
}

/**
 * Get the position (0-8) where a tile with a given ID is currently located
 */
export function getTilePositionInGrid(tiles, tileId) {
  return tiles.findIndex(tile => tile.id === tileId);
}

/**
 * Get the background position offset for a tile based on its ID
 * Used for CSS background-position to crop the tile image correctly
 * Returns { backgroundPositionX, backgroundPositionY } as percentages
 */
export function getTileBackgroundPosition(tileId) {
  const col = tileId % 3;
  const row = Math.floor(tileId / 3);
  
  return {
    backgroundPositionX: `${col * 33.333}%`,
    backgroundPositionY: `${row * 33.333}%`,
  };
}

/**
 * Get the tile size (width/height) based on container size
 * For CSS background-size: this should be 300% for a 3x3 grid (100% * 3)
 */
export const TILE_BACKGROUND_SIZE = "300% 300%";
