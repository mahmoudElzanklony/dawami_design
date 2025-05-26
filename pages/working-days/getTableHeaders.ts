export const getTableHeaders = (t: (key: string) => string): any[] => [
    {title: t('working_days.table.name'), key: 'name', align: 'center'},
    {title: t('working_days.table.field'), key: 'field_name', align: 'center'},
    {title: t('working_days.table.instructor'), key: 'instructor', align: 'center'},
    {title: t('working_days.table.groups'), key: 'groups', sortable: false, align: 'center'},
    {title: t('working_days.table.status'), key: 'status', align: 'center'},
    {title: t('working_days.table.time'), key: 'time', sortable: false, align: 'center'},
    {title: t('working_days.table.allowed_time'), key: 'allowed_time', align: 'center'},
    {title: t('working_days.table.check_location'), key: 'check_location', align: 'center'},
    {title: "", key: 'actions', sortable: false, align: 'center'},
];
