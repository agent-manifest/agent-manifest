// ISBN-10 and ISBN-13 checksum validation (ASV-WORK-010).

export function isValidIsbn(value) {
  if (typeof value !== 'string') return false;
  const raw = value.replace(/[\s-]/g, '');
  if (/^\d{9}[\dX]$/.test(raw)) return isbn10Valid(raw);
  if (/^\d{13}$/.test(raw)) return isbn13Valid(raw);
  return false;
}

function isbn10Valid(s) {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (i + 1) * Number(s[i]);
  const check = s[9] === 'X' ? 10 : Number(s[9]);
  sum += 10 * check;
  return sum % 11 === 0;
}

function isbn13Valid(s) {
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += (i % 2 === 0 ? 1 : 3) * Number(s[i]);
  return sum % 10 === 0;
}
