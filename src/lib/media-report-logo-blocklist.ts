const BLOCKLIST_TOKENS = [
  'alamain',
  'alamin',
  'alamein',
  'magawish',
  'hyatt regency',
  'hyatt-regency',
  'nikki beach',
  'nikki-beach',
  'premium seagate',
  'premium-seagate',
  'premium seag',
  'ajet',
  'marriot dead sea',
  'marriott dead sea',
  'jordan tourism board',
  'jordan-tourism-board',
  'swissotel sharm',
  'swissôtel sharm',
  'vida hotel',
  'sharm el sheikh',
  'sharm-el-sheikh',
];

export function isBlockedMediaReportLogo(value: string): boolean {
  const s = String(value || '').toLowerCase();
  return BLOCKLIST_TOKENS.some((token) => s.includes(token));
}

