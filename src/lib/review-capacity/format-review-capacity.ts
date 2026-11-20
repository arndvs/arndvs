const wholeAndTenths = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export const formatNumber = (value: number): string => wholeAndTenths.format(value);

/** A count with its noun, such as "1 PR" or "2 PRs". */
export const formatCount = (value: number, noun: string): string =>
    `${formatNumber(value)} ${value === 1 ? noun : `${noun}s`}`;

export const describeBalance = (balance: number): string =>
    balance >= 0
        ? `${formatCount(balance, "line")} of spare review capacity a day.`
        : `${formatCount(-balance, "line")} a day left unreviewed.`;
