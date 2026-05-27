/**
 * Semantic Search Service
 * Handles all semantic search operations for ideas, projects, and profiles
 */

const SEMANTIC_SEARCH_BASE_URL = 'https://collabhub-dmnz.onrender.com';

class SemanticSearchService {
  /**
   * Search for profiles using semantic search
   * @param {string} query - Search query
   * @param {number} topK - Number of results to return
   * @returns {Promise<Array>} - Array of profile results
   */
  async searchProfiles(query, topK = 20) {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/api/search/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: topK }),
      });

      if (!response.ok) {
        throw new Error('Semantic search request failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.warn('Semantic profile search failed:', error);
      return [];
    }
  }

  /**
   * Search for ideas using semantic search
   * @param {string} query - Search query
   * @param {number} topK - Number of results to return
   * @returns {Promise<Array>} - Array of idea results
   */
  async searchIdeas(query, topK = 20) {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type: 'ideas', top_k: topK }),
      });

      if (!response.ok) {
        throw new Error('Semantic search request failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.warn('Semantic idea search failed:', error);
      return [];
    }
  }

  /**
   * Search for projects using semantic search
   * @param {string} query - Search query
   * @param {number} topK - Number of results to return
   * @returns {Promise<Array>} - Array of project results
   */
  async searchProjects(query, topK = 20) {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type: 'projects', top_k: topK }),
      });

      if (!response.ok) {
        throw new Error('Semantic search request failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.warn('Semantic project search failed:', error);
      return [];
    }
  }

  /**
   * Index a profile for semantic search
   * @param {Object} profileData - Profile data to index
   * @returns {Promise<boolean>} - Success status
   */
  async indexProfile(profileData) {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/api/index/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Profile indexing failed');
      }

      return true;
    } catch (error) {
      console.warn('Profile indexing failed:', error);
      return false;
    }
  }

  /**
   * Submit a new idea or project
   * @param {string} type - 'ideas' or 'projects'
   * @param {Object} data - Idea/project data
   * @returns {Promise<Object>} - Response with id
   */
  async submitContent(type, data) {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type }),
      });

      if (!response.ok) {
        throw new Error('Content submission failed');
      }

      return await response.json();
    } catch (error) {
      console.warn('Content submission failed:', error);
      throw error;
    }
  }

  /**
   * Delete an idea or project
   * @param {string} type - 'ideas' or 'projects'
   * @param {string} id - Document ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteContent(type, id) {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/api/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      });

      if (!response.ok) {
        throw new Error('Content deletion failed');
      }

      return true;
    } catch (error) {
      console.warn('Content deletion failed:', error);
      return false;
    }
  }

  /**
   * Get semantic search statistics
   * @returns {Promise<Object>} - Statistics object
   */
  async getStats() {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/api/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch semantic search stats:', error);
      return { ideas_count: 0, projects_count: 0, profiles_count: 0 };
    }
  }

  /**
   * Check if semantic search service is available
   * @returns {Promise<boolean>} - Availability status
   */
  async isAvailable() {
    try {
      const response = await fetch(`${SEMANTIC_SEARCH_BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const semanticSearchService = new SemanticSearchService();
export default semanticSearchService;
