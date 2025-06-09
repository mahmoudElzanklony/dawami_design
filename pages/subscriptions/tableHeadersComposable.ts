export const getTableHeaders = (t: (key: string) => string): any[] => [
    {title: t('subscriptions.table.id'), key: 'id', align: 'center'},
    {title: t('subscriptions.table.student'), key: 'user.username', align: 'center'},
    {title: t('subscriptions.table.doctor'), key: 'username', align: 'center'},
    {title: t('subscriptions.table.subject'), key: 'field.name', align: 'center'},
    {title: t('subscriptions.table.amountDue'), key: 'price', align: 'center'},
    {title: t('subscriptions.table.discountAmount'), key: 'discount', align: 'center'},
    {title: t('subscriptions.table.notes'), key: 'note', align: 'center'},
    {title: t('subscriptions.table.createdAt'), key: 'created_at', align: 'center'},
    {title: '', key: 'actions', sortable: false, align: 'center'},
];