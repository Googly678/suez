export const DEFAULT_COMPENSATION_LIMIT_DETAILS = [
  '每次事故赔偿限额：¥5,000,000.00',
  '保单累计赔偿限额：¥10,000,000.00',
  '附加盗抢险每次限额：¥200,000.00',
  '附加盗抢险累计限额：¥500,000.00',
].join('\n');

export const getCompensationLimitDisplay = (value?: string | number | null) => {
  const raw = String(value ?? '').trim();
  return raw || DEFAULT_COMPENSATION_LIMIT_DETAILS;
};