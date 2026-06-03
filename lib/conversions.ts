export function convertToBaseUnit(
  quantity: number,
  unit: string
) {
  const conversions: Record<string, number> = {
    kg: 1000,
    g: 1,

    L: 1000,
    mL: 1,

    item: 1,
  };

  return quantity * (conversions[unit] || 1);
}