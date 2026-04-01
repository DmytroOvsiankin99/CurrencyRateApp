export type CnbRateRow = {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
};

export type CnbDailyRates = {
  dateText: string;
  sequenceInYear: number | null;
  rows: CnbRateRow[];
};


const DAILY_URL =
  "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";

export function getCzkPerUnit(row: CnbRateRow): number {
  return row.rate / row.amount;
}

export function convertFromCzk(czk: number, row: CnbRateRow): number {
  // foreign = czk * amount / rate
  return (czk * row.amount) / row.rate;
}

export async function fetchCnbDailyTxt(): Promise<string> {
  const res = await fetch(DAILY_URL);
  if (!res.ok) {
    throw new Error(`ČNB daily.txt HTTP ${res.status}`);
  }
  return await res.text();
}

export function parseCnbDailyTxt(text: string): CnbDailyRates {
  const normalized = text.replace(/\r/g, "\n");

  // Date & sequence: everything before # is date text, number after # is sequence (best-effort).
  const firstLineMatch = normalized.match(/^(.+?)\s+#(\d+)/m);
  const dateText = firstLineMatch?.[1]?.trim() ?? "";
  const sequenceInYear = firstLineMatch ? Number(firstLineMatch[2]) : null;

  // Robust row extraction: match Country|Currency|Amount|Code|Rate regardless of line breaks.
  const rowRegex =
    /([^|\n]+)\|([^|\n]+)\|(\d+)\|([A-Z]{3})\|(\d+(?:\.\d+)?)/g;

  const rows: CnbRateRow[] = [];
  let m: RegExpExecArray | null;

  while ((m = rowRegex.exec(normalized)) !== null) {
    const country = m[1].trim();
    const currency = m[2].trim();
    const amount = Number(m[3]);
    const code = m[4].trim();
    const rate = Number(m[5]);

    if (!Number.isFinite(amount) || !Number.isFinite(rate)) continue;

    rows.push({ country, currency, amount, code, rate });
  }

  // Sort by currency code for stable UI.
  rows.sort((a, b) => a.code.localeCompare(b.code));

  return {
    dateText,
    sequenceInYear: Number.isFinite(sequenceInYear) ? sequenceInYear : null,
    rows
  };
}

export async function getCnbDailyRates(): Promise<CnbDailyRates> {
  const txt = await fetchCnbDailyTxt();
  return parseCnbDailyTxt(txt);
}
