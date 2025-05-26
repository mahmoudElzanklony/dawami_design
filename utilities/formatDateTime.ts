export const formatDateTime = (dateTimeString: string, locale?: string) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    // Use provided locale or fall back to 'ar-EG' for backward compatibility
    const formattingLocale = locale || 'ar-EG';
    return `${date.toLocaleDateString(formattingLocale)} ${date.toLocaleTimeString(formattingLocale, {hour: '2-digit', minute:'2-digit'})}`;
};
