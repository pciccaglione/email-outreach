/**
 * Utility functions for randomization
 */

/**
 * Get random item from array
 * @param {Array} array - Array to select from
 * @returns {*} Random item
 */
function getRandomItem(array) {
  if (!array || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random subset of array
 * @param {Array} array - Source array
 * @param {number} count - Number of items to select
 * @returns {Array} Random subset
 */
function getRandomSubset(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Calculate random delay within range
 * @param {number} minMinutes - Minimum delay in minutes
 * @param {number} maxMinutes - Maximum delay in minutes
 * @returns {number} Random delay in milliseconds
 */
function getRandomDelay(minMinutes, maxMinutes) {
  const minMs = minMinutes * 60 * 1000;
  const maxMs = maxMinutes * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Get random time within business hours
 * @param {number} startHour - Business hours start (0-23)
 * @param {number} endHour - Business hours end (0-23)
 * @returns {Date} Random datetime within today's business hours
 */
function getRandomBusinessTime(startHour = 8, endHour = 17) {
  const now = new Date();
  const randomHour = getRandomInt(startHour, endHour - 1);
  const randomMinute = getRandomInt(0, 59);
  
  now.setHours(randomHour, randomMinute, 0, 0);
  return now;
}

/**
 * Check if a value should be selected based on percentage
 * @param {number} percentage - Probability (0-100)
 * @returns {boolean} True if selected
 */
function shouldSelect(percentage) {
  return Math.random() * 100 < percentage;
}

module.exports = {
  getRandomItem,
  getRandomInt,
  shuffleArray,
  getRandomSubset,
  getRandomDelay,
  getRandomBusinessTime,
  shouldSelect
};
