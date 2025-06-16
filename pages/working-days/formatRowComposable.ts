import {formatDateTime} from '~/utilities/formatDateTime';

export const formatRow = (item: any, t?: any, locale?: string) => {
    const translatedText = t || ((key: string) => key); // Fallback if t is not provided

    const formatTimeWithEnglishAMPM = (timeStr: string) => {
        if (!timeStr) return '-';
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return '-';
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
    
    return [
        item.name,
        item.field?.name || '-',
        item.user?.username || '-',
        // Add groups representation (limited to avoid clutter)
        (item.groups || []).slice(0, 2).map((g: any) => g.name).join(', ') + 
            ((item.groups || []).length > 2 ? `, +${item.groups.length - 2}` : ''),
        item.status === 'online' ? translatedText('working_days.status_online') : translatedText('working_days.status_offline'),
        `${formatTimeWithEnglishAMPM(item.time_start)} - ${formatTimeWithEnglishAMPM(item.time_end)}`,
        `${item.allowed_time} ${translatedText('working_days.minutes')}`,
        item.check_location ? translatedText('working_days.yes') : translatedText('working_days.no')
    ];
};
