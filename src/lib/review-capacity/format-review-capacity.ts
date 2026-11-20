const wholeAndTenths = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export const formatNumber = (value: number): string => wholeAndTenths.format(value);

/** A count with its noun, such as "1 PR" or "2 PRs". */
export const countOf = (value: number, noun: string): string =>
    `${formatNumber(value)} ${value === 1 ? noun : `${noun}s`}`;

/** Says whether the day has spare review capacity or lines left unreviewed. */
export const describeBalance = (balance: number): string =>
    balance >= 0
        ? `${countOf(balance, "line")} of spare review capacity a day.`
        : `${countOf(-balance, "line")} a day left unreviewed.`;
