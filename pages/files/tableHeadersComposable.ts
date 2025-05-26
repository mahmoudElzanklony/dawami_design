export const getTableHeaders = (t: (key: string) => string): any[] =>  [
    {title: t('files.filename'), key: 'name', align: 'center'},
    {title: t('files.filetype'), key: 'extension', align: 'center'},
    {title: t('files.branch'), key: 'fileable.branch.name', align: 'center'},
    {title: t('files.subject'), key: 'fileable.name', align: 'center'},
    {title: t('files.semester'), key: 'fileable.semester', align: 'center'},
    {title: t('files.price'), key: 'fileable.price', align: 'center'},
    {title: t('files.created_at'), key: 'created_at', align: 'center'},
    {title: '', key: 'actions', sortable: false, align: 'center'},
];
