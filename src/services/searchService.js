const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL || 'https://collabhub-dmnz.onrender.com';

export const searchProfiles = async (query, topK = 20) => {
  try {
    const response = await fetch(`${SEARCH_API_URL}/api/search/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        top_k: topK,
      }),
    });

    if (!response.ok) {
      throw new Error('Search request failed');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching profiles:', error);
    return [];
  }
};

export const indexProfile = async (profileData) => {
  try {
    const response = await fetch(`${SEARCH_API_URL}/api/index/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to index profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error indexing profile:', error);
    return null;
  }
};
