import { formatDate } from '~/composables/FormatDateComposable';

export const formatRowComposable = () => {
    const { t } = useI18n();

    const formatSubscriptionRow = (item: any) => {
        return [
            item.id,
            item?.user?.username,
            item?.username,
            item?.field?.name,
            item.price,
            item.discount,
            item.note,
            formatDate(item.created_at)
        ];
    };

    return {
        formatSubscriptionRow
    };
};
