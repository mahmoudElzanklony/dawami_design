export const getTableHeaders = (t: (key: string) => string): any[] =>   [
    {title: t('bills.table.doctor'), key: 'doctor', align: 'center'},
    {title: t('bills.table.phone'), key: 'phone', align: 'center'},
    {title: t('bills.table.start_date'), key: 'start_date', align: 'center'},
    {title: t('bills.table.end_date'), key: 'end_date', align: 'center'},
    {title: t('bills.table.total_money'), key: 'total_money', align: 'center'},
    {title: t('bills.table.amount_paid'), key: 'amount_paid', align: 'center'},
    {title: t('bills.table.remain'), key: 'remain', align: 'center'},
    {title: t('bills.table.notes'), key: 'note', align: 'center'},
    {title: t('bills.table.created_at'), key: 'created_at', align: 'center'},
    {title: '', key: 'actions', sortable: false, align: 'center'},
];