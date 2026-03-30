/**
 * Company metrics — single source of truth.
 * Update this file when numbers change. All Stats widgets read from here.
 */
export const metrics = {
  customers: {
    value: '8',
    label: 'Beta Customers',
    updatedAt: '2026-03',
  },
  proposalTime: {
    value: '3x',
    label: 'Faster Proposals',
    source: 'Beta customer average',
    updatedAt: '2026-03',
  },
  utilizationImprovement: {
    value: '68.9%',
    label: 'Billable Utilization',
    source: 'Industry benchmark (Deltek)',
    updatedAt: '2026-03',
  },
  projectsLate: {
    value: '1 in 4',
    label: 'Projects Delivered Late',
    source: 'Industry benchmark',
    updatedAt: '2026-03',
  },
  marginTarget: {
    value: '20%',
    label: 'Hit Profit Margin Targets',
    source: 'SPI Research',
    updatedAt: '2026-03',
  },
  growthDecline: {
    value: '-4.6%',
    label: 'Revenue Growth Decline',
    source: 'SPI Research',
    updatedAt: '2026-03',
  },
} as const;
