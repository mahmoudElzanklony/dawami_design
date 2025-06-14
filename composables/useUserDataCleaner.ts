/**
 * Composable for cleaning and compressing user data to reduce storage size
 */
export function useUserDataCleaner() {
  /**
   * Clean and compress user data for storage
   * @param userData - The raw user data from API
   * @returns Cleaned user data with minimal required fields
   */
  const cleanUserData = (userData: any) => {
    if (!userData) return null;

    const cleanedUser = {
      id: userData.id,
      username: userData.username,
      type: userData.type,
      organizations: userData.organizations ? userData.organizations.map(org => ({
        id: org.id,
        organization_id: org.organization_id
      })) : [],
      // Compress permissions
      permissions: compressPermissions(userData.permissions || [])
    };
    
    return cleanedUser;
  };
  
  /**
   * Compress permissions data to a more compact format
   * @param permissions - The original permissions array
   * @returns Compressed permissions structure
   */
  const compressPermissions = (permissions: any[]) => {
    // Create a map of route -> actions
    const routeActionMap: Record<string, Record<string, boolean>> = {};
    
    permissions.forEach(permGroup => {
      if (!permGroup.data || !Array.isArray(permGroup.data)) return;
      
      permGroup.data.forEach(perm => {
        const route = perm.route;
        const action = perm.action;
        
        if (!route || !action) return;
        

        if (!routeActionMap[route]) {
          routeActionMap[route] = {};
        }
        

        routeActionMap[route][action] = true;
      });
    });

    return Object.entries(routeActionMap).map(([route, actions]) => ({
      route,
      actions
    }));
  };
  
  return {
    cleanUserData,
    compressPermissions,
  };
}
