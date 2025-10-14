// Authentication utilities for client-side usage

export interface User {
  email: string;
  loginTime: string;
}

/**
 * Check if user is authenticated by reading the auth token from cookies
 */
export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  
  return !!authCookie;
}

/**
 * Get user information from the auth token
 */
export function getCurrentUser(): User | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => 
      cookie.trim().startsWith('auth-token=')
    );
    
    if (!authCookie) return null;
    
    const token = authCookie.split('=')[1];
    const decoded = atob(token);
    const [email, timestamp] = decoded.split(':');
    
    return {
      email,
      loginTime: new Date(parseInt(timestamp)).toISOString()
    };
  } catch (error) {
    console.error('Error decoding auth token:', error);
    return null;
  }
}

/**
 * Logout user by redirecting to logout endpoint
 */
export function logout(): void {
  window.location.href = '/logout';
}

/**
 * Redirect to login page
 */
export function redirectToLogin(): void {
  window.location.href = '/login';
}

/**
 * Check authentication and redirect if not authenticated
 */
export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    redirectToLogin();
    return false;
  }
  return true;
}
