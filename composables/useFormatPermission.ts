import { useI18n } from '#imports';

export const useFormatPermission = () => {
  const { t } = useI18n();

  /**
   * Format permission full_name into human-readable components
   * Format: icon|route|action|scope(optional)
   * Example: fa-duotone fa-solid fa-user-robot|/assistants|read|all
   */
  const formatPermission = (fullName: string) => {
    if (!fullName) return { display: '', icon: '', route: '', action: '', scope: '' };

    const parts = fullName.split('|');

    // Extract components
    const icon = parts[0] || '';
    const route = parts[1] || '';
    const action = parts[2] || '';
    const scope = parts.length > 3 ? parts[3] : '';

    // Format route for display (remove slashes and capitalize)
    const routeKey = route.replace(/\//g, '')
      .toLowerCase();

    // Get translated action name
    const actionDisplay = t(`permissions.actions.${action}`, action);

    // Get translated scope name if it exists
    let scopeDisplay = '';
    if (scope) {
      scopeDisplay = t(`permissions.scopes.${scope}`, scope);
    }

    // Get translated route name if it exists in navigation
    const routeTranslated = t(`navigation.${routeKey}`, routeKey);

    // Create display name
    let display = '';

    // Combine parts into a readable permission
    if (scope) {
      display = `${actionDisplay} ${routeTranslated} (${scopeDisplay})`;
    } else {
      display = `${actionDisplay} ${routeTranslated}`;
    }

    return {
      display,
      icon,
      route,
      action,
      scope,
      routeDisplay: routeTranslated,
      actionDisplay,
      scopeDisplay
    };
  };


  const getPermissionChipColor = (action: string) => {
    switch(action.toLowerCase()) {
      case 'create':
        return 'success';
      case 'read':
        return 'primary';
      case 'update':
        return 'warning';
      case 'delete':
        return 'error';
      default:
        return 'primary';
    }
  };

  return {
    formatPermission,
    getPermissionChipColor
  };
};
