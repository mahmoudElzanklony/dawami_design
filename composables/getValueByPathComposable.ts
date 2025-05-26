export default function getValueByPath(obj: Record<string, any>, path: string): any {
    if(!obj || !path) return;
    return path.split('.').reduce((o, p) => (o && o[p] !== undefined) ? o[p] : null, obj);
}