import { formatDate } from '~/composables/FormatDateComposable';

export const useBillsPdfFormat = () => {
    const formatBillRow = (item: any) => {
        return [
            item.doctor?.username || '',
            item.doctor?.phone || '',
            item.start_date || '',
            item.end_date || '',
            item.total_money || 0,
            (item.total_money - item.remain) || 0,
            item.remain || 0,
            item.note || '',
            formatDate(item.created_at)
        ];
    };

    return {
        formatBillRow
    };
};