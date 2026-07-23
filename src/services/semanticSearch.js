/**
 * Semantic Search Service
 * Connects to the Python Flask backend for FAISS vector search and indexing.
 */

const API_BASE_URL = 'https://collabhub-dmnz.onrender.com/api';

class SemanticSearchService {
  /**
   * Search across a specific index
   */
  async _search(query, type, topK = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          type,
          top_k: topK
        }),
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`Error in semantic search for ${type}:`, error);
      throw error;
    }
  }

  /**
   * Search for profiles
   */
  async searchProfiles(queryText, topK = 10) {
    return this._search(queryText, 'profiles', topK);
  }

  /**
   * Search for ideas
   */
  async searchIdeas(queryText, topK = 10) {
    return this._search(queryText, 'ideas', topK);
  }

  /**
   * Search for projects
   */
  async searchProjects(queryText, topK = 10) {
    return this._search(queryText, 'projects', topK);
  }

  /**
   * Add or update a profile in the search index
   */
  async indexProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Indexing API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error indexing profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add or update content (ideas/projects) in the search index
   */
  async submitContent(type, data) {
    try {
      const endpoint = type === 'idea' ? 'ideas' : 'projects';
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Content submission API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error submitting ${type}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete content from the search index
   */
  async deleteContent(type, id) {
    try {
      const endpoint = type === 'idea' ? 'ideas' : 'projects';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Delete API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get search statistics
   */
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      
      if (!response.ok) {
        throw new Error(`Stats API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching search stats:', error);
      return null;
    }
  }

  /**
   * Health check to see if semantic search backend is available
   */
  async isAvailable() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const semanticSearchService = new SemanticSearchService();
export default semanticSearchService;
