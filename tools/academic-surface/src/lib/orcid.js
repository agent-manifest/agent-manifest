// ORCID iD validation: format + ISO 7064 MOD 11-2 checksum on the 16 digits.

const ORCID_RE = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;

/** True when `value` is a well-formed ORCID with a valid check digit. */
export function isValidOrcid(value) {
  if (typeof value !== 'string' || !ORCID_RE.test(value)) return false;
  const digits = value.replace(/-/g, '');
  const base = digits.slice(0, 15);
  const check = digits.slice(15); // '0'..'9' or 'X'
  let total = 0;
  for (const ch of base) {
    total = (total + Number(ch)) * 2;
  }
  const remainder = total % 11;
  const result = (12 - remainder) % 11;
  const expected = result === 10 ? 'X' : String(result);
  return expected === check;
}
