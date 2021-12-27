type Success = { result: unknown };

type Error = { error: { code: number; message: string; data: unknown } };

export const sendJSONRPCRequest = async <T>(
  method: string,
  params: T[] | Record<string, unknown> = []
): Promise<Success | Error> => {
  const response = await fetch("/api", {
    body: JSON.stringify({ id: 1, jsonrpc: "2.0", method, params }),
    method: "post",
  });
  return await response.json();
};

const dateStringPattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

export const stringToDate = (dateString: string): Date | undefined => {
  const match = dateString.match(dateStringPattern);
  if (!match) return;
  const [, year, month, day] = match;
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
};

export const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const intersperse = <T, U>(array: T[], separator: U): (T | U)[] =>
  array
    .reduce<(T | U)[]>(
      (accumulator, current) => [...accumulator, separator, current],
      []
    )
    .slice(1);
