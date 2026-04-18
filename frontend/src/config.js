/**
 * Application Configuration
 * 
 * You can override these values using environmental variables:
 * - VITE_API_BASE_URL
 * - VITE_VIDEO_BASE_URL
 */

export const CONFIG = {
    // Falls back to localhost:4000 for the backend API
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
    
    // Falls back to localhost:8000 for the video server (FMS-Assessment backend)
    VIDEO_BASE_URL: import.meta.env.VITE_VIDEO_BASE_URL || "http://localhost:8000",
};
