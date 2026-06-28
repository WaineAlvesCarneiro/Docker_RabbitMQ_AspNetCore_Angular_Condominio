export function isCnpjValid(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calc = (t: number) => {
    const slice = digits.slice(0, t);
    let sum = 0;
    let pos = t - 7;
    for (let i = t; i >= 1; i--) {
      sum += parseInt(slice[t - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };

  const v1 = calc(12);
  const v2 = calc(13);
  return v1 === parseInt(digits[12]) && v2 === parseInt(digits[13]);
}
