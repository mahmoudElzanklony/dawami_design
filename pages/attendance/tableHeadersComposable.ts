export const getTableHeaders = (t: (key: string) => string): any[] => [
    {title: t('attendance.table.user'), key: 'user.username', align: 'center'},
    {title: t('attendance.table.working_day'), key: 'working_day.name', align: 'center'},
    {title: t('attendance.table.working_day_status'), key: 'working_day.status', align: 'center'},
    {title: t('attendance.table.attendance_status'), key: 'status', align: 'center'},
    {title: t('attendance.table.tracking_records'), key: 'tracking_info', sortable: false, align: 'center'},
    {title: t('attendance.table.distance_from_place'), key: 'distance', sortable: false, align: 'center'},
    {title: t('attendance.table.check_count'), key: 'checks_number', sortable: false, align: 'center'},
    {title: t('attendance.table.notes'), key: 'note', sortable: false, align: 'center'},
    {title: t('attendance.table.created_at'), key: 'created_at', align: 'center'},
    {title: '', key: 'actions', sortable: false, align: 'center'},
];
