import {formatDateTime} from '~/utilities/formatDateTime';

export const formatRow = (item: any, t?: any, locale?: string) => {
    const translatedText = t || ((key: string) => key); // Fallback if t is not provided
    
    return [
        item.name,
        item.field?.name || '-',
        item.user?.username || '-',
        // Add groups representation (limited to avoid clutter)
        (item.groups || []).slice(0, 2).map((g: any) => g.name).join(', ') + 
            ((item.groups || []).length > 2 ? `, +${item.groups.length - 2}` : ''),
        item.status === 'online' ? translatedText('working_days.status_open') : translatedText('working_days.status_closed'),
        `${translatedText('working_days.time_from')}: ${formatDateTime(item.time_start, locale)}
         ${translatedText('working_days.time_to')}: ${formatDateTime(item.time_end, locale)}`,
        `${item.allowed_time} ${translatedText('working_days.minutes')}`,
        item.check_location ? translatedText('working_days.yes') : translatedText('working_days.no')
    ];
};
