/**
 * Helper to generate unique human-readable entity codes (e.g., REQ-98234, DEL-48192, CON-38192)
 * @param {string} prefix - Entity prefix (e.g., 'REQ', 'DEL', 'CON', 'TRIP')
 * @returns {string} Unique code
 */
export const generateEntityCode = (prefix) => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomDigits}`;
};
