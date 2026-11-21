export function classificationColor(classification) {
  if (classification === 'Spam') return '#DC2626';
  if (classification === 'Suspicious') return '#EA580C';
  if (classification === 'Trusted') return '#16A34A';
  return '#64748B';
}

export function badgeStyle(classification) {
  const color = classificationColor(classification);
  return { color, backgroundColor: `${color}18` };
}
