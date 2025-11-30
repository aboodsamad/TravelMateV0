import { getAuthHeaders } from '../config/auth.js';

const API_BASE_URL = "http://localhost:5000/api";

export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }
      
      return await response.json();
    } catch (error) {
      console.error("getProfile error:", error);
      throw error;
    }
  },

  // Get user activity logs
  getUserLogs: async (params = {}) => {
    const { page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    try {
      const response = await fetch(`${API_BASE_URL}/users/logs?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user logs");
      }
      
      return await response.json();
    } catch (error) {
      console.error("getUserLogs error:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      return await response.json();
    } catch (error) {
      console.error("updateProfile error:", error);
      throw error;
    }
  },

  // Get user's liked places
  getLikedPlaces: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/liked-places`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch liked places");
      }
      
      return await response.json();
    } catch (error) {
      console.error("getLikedPlaces error:", error);
      throw error;
    }
  },

  // Like a place
  likePlace: async (placeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/liked-places`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ placeId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to like place");
      }
      
      return await response.json();
    } catch (error) {
      console.error("likePlace error:", error);
      throw error;
    }
  },

  // Unlike a place
  unlikePlace: async (placeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/liked-places/${placeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to unlike place");
      }
      
      return await response.json();
    } catch (error) {
      console.error("unlikePlace error:", error);
      throw error;
    }
  }
};
