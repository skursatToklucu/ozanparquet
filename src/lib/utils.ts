// GitHub Pages base path configuration
const BASE_PATH = import.meta.env.BASE_URL || '/';

/**
 * Adds the base path to a URL for GitHub Pages compatibility
 * @param path - The path to prepend with base path (e.g., '/products')
 * @returns The full path with base path (e.g., '/ozanparquet/products')
 */
export function getUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove trailing slash from base path if present
  const cleanBase = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;
  
  // Handle root path
  if (!cleanPath || cleanPath === 'index.html') {
    return cleanBase || '/';
  }
  
  return `${cleanBase}/${cleanPath}`;
}

/**
 * Gets the current path without the base path
 * @returns The current path without base path
 */
export function getCurrentPath(): string {
  const fullPath = window.location.pathname;
  const basePath = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;
  
  if (fullPath.startsWith(basePath)) {
    const path = fullPath.slice(basePath.length);
    return path || '/';
  }
  
  return fullPath;
}
