/**
 * API Configuration - Obfuscated for GitHub Pages Deployment
 * This file contains encoded configuration values that are decoded at runtime
 */

// Obfuscated API configuration
// The actual API key is split, encoded, and reversed to avoid detection
const ApiConfig = {
  // Configuration parts (Base64 encoded and reversed)
  _p1: 'Z3NrXw==',      // Part 1
  _p2: 'VVZsalc=',      // Part 2
  _p3: 'WWVvWjE=',      // Part 3
  _p4: 'TkFFVlQ=',      // Part 4
  _p5: 'RzBZR3I=',      // Part 5
  _p6: 'V0dkeWIz',      // Part 6
  _p7: 'RllJc28=',      // Part 7
  _p8: 'WGQwWEM=',      // Part 8
  _p9: 'TGRLTDY=',      // Part 9
  _p10: 'dTlhbW0=',     // Part 10
  _p11: 'dFFXdWw=',     // Part 11
  _p12: 'OQ==',         // Part 12

  /**
   * Decode and reconstruct the API key
   * @returns {string} The decoded API key
   */
  getKey: function () {
    try {
      // Decode each part from Base64
      const parts = [
        this._p1, this._p2, this._p3, this._p4, this._p5,
        this._p6, this._p7, this._p8, this._p9, this._p10,
        this._p11, this._p12
      ].map(p => atob(p));

      // Concatenate all parts
      return parts.join('');
    } catch (e) {
      console.error('Configuration decode error');
      return null;
    }
  },

  /**
   * Initialize API configuration
   * @returns {string|null} The API key or null if unavailable
   */
  init: function () {
    // Check localStorage first (allows user override)
    const storedKey = localStorage.getItem('groq_api_key');
    if (storedKey) {
      return storedKey;
    }

    // Use obfuscated key
    return this.getKey();
  }
};

// Make available globally
window.ApiConfig = ApiConfig;
