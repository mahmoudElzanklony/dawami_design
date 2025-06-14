import { useAuthStore } from '~/stores/Auth/AuthStore';

/**
 * Composable for working with user permissions
 */
export function usePermissions() {
  const authStore = useAuthStore();
  
  /**
   * Check if user can perform a specific action on a route
   * @param route - The route path
   * @param action - The action (read, create, update, delete)
   * @returns boolean indicating if the user has permission
   */
  const can = (route: string, action: string = 'read'): boolean => {
    return authStore.hasActionPermission(route, action);
  };
  
  /**
   * Check if user can access a specific route
   * @param route - The route path
   * @returns boolean indicating if the user has permission
   */
  const canAccess = (route: string): boolean => {
    return authStore.hasRoutePermission(route);
  };
  
  /**
   * Get all routes user has permission to access
   * @returns Array of route paths
   */
  const getAccessibleRoutes = (): string[] => {
    return authStore.getPermittedRoutes();
  };
  
  return {
    can,
    canAccess,
    getAccessibleRoutes
  };
}
