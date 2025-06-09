import { formatDate } from '~/composables/FormatDateComposable';

export const useAttendancePdfFormat = (t: (key: string) => string) => {
    const formatStatus = (status: string) => {
        if (status === 'attend') return t('attendance.status.attend');
        if (status === 'absent') return t('attendance.status.absent');
        if (status === 'late') return t('attendance.status.late');
        return status || '';
    };

    const formatDistance = (distance: any) => {
        if (distance === '-') return '-';
      
        const distanceNum = parseFloat(distance);

        if (distanceNum === 0) {
          return t('attendance.distance.inside_area');
        }
        
        if (distanceNum < 1) {
          // Convert to meters and round to nearest meter
          const meters = Math.round(distanceNum * 1000);
          return `${meters} ${t('attendance.distance.meter')}`;
        }
      
        return `${distance} ${t('attendance.distance.km')}`;
    };

    const formatAttendanceRow = (item: any, calculateDistance: (item: any) => any) => {
        return [
            item.user?.username || '',
            item.working_day?.name || '',
            item.working_day?.status || '',
            formatStatus(item.working_day?.attendance_status),
            item.tracking?.length ? `${item.tracking.length} ${t('attendance.tracking')}` : '-',
            formatDistance(calculateDistance(item)),
            item.checks_number,
            item.note || '-',
            formatDate(item.created_at)
        ];
    };

    return {
        formatAttendanceRow,
        formatStatus,
        formatDistance
    };
};
