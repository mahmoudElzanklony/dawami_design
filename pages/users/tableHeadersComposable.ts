export const getTableHeaders = (t: (key: string) => string): any[] => [
    {title: t('users.table.avatar'), key: 'avatar', sortable: false, align: 'center'},
    {title: t('users.table.name'), key: 'username', align: 'center'},
    {title: t('users.table.phone'), key: 'phone', align: 'center'},
    {title: t('users.table.type'), key: 'type', align: 'center'},
    {title: t('users.table.nationality'), key: 'nationality', align: 'center'},
    {title: t('users.table.device'), key: 'ip', sortable: false, align: 'center'},
    {title: t('users.table.status'), key: 'is_block', sortable: false, align: 'center'},
    {title: t('users.table.studentCount'), key: 'unique_students', sortable: false, align: 'center'},
    {title: t('users.table.createdAt'), key: 'created_at', align: 'center'},
    {title: '', key: 'actions', sortable: false, align: 'center'},
];
