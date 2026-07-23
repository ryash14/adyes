/**
 * Search Service
 * Profile search using Firestore — no external API needed
 */

import { semanticSearchService } from './semanticSearch';

export const searchProfiles = async (query, topK = 20) => {
  return semanticSearchService.searchProfiles(query, topK);
};

export const indexProfile = async (_profileData) => {
  // No-op — profile data lives in Firestore
  return { success: true };
};
