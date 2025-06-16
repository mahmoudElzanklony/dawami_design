export const formatDateTime = (dateTimeString: string, locale?: string) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    const formattingLocale = locale || 'ar-EG';
    return `${date.toLocaleDateString(formattingLocale)} ${date.toLocaleTimeString(formattingLocale, {hour: '2-digit', minute:'2-digit'})}`;
};

export const formatTime = (dateTimeString: string, locale?: string) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    const formattingLocale = "en-Us";
    return date.toLocaleTimeString(formattingLocale, {hour: '2-digit', minute:'2-digit'});
};
