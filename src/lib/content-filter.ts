export function filterByStatus<T extends { data: { status?: string } }>(
  items: T[],
): T[] {
  const isProduction = import.meta.env.PROD;
  return items.filter(item => {
    const status = item.data.status || 'published';
    if (status === 'hidden') return false;
    if (status === 'draft' && isProduction) return false;
    return true;
  });
}
