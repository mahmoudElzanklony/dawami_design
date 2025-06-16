import { formatDate } from '~/composables/FormatDateComposable';

export const formatRowComposable = () => {
    const { t } = useI18n();

    const formatUserRow = (item: any) => {
        return [
            item.username,
            item.phone,
            item.type === 'admin' ? t('users.types.admin') : t('users.types.doctor'),
            item.nationality,
            item.ip ? t('users.status.registered') : t('users.status.not_registered'),
            item.is_block ? t('users.status.blocked') : t('users.status.active'),
            item.unique_students,
            formatDate(item.created_at)
        ];
    };

    return {
        formatUserRow
    };
};
