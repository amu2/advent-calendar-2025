// Helper to handle basePath for GitHub Pages
const BASE_PATH = '/advent-calendar-2025';

/**
 * Adds basePath prefix to a path for GitHub Pages deployment
 * @param path - The path relative to public directory (e.g., '/sounds/door.mp3')
 * @returns The full path including basePath
 */
export function getAssetPath(path: string): string {
  // In development, don't add basePath
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  
  // In production (GitHub Pages), add basePath
  return `${BASE_PATH}${path}`;
}
