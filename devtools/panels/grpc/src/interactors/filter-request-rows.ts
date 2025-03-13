import { Filter } from "@/entities/filter";
import { RequestRow } from "@/entities/request-row";

export const filterRequestRows = ({
  requestRows,
  filter,
}: {
  requestRows: RequestRow[];
  filter: Filter;
}) => {
  try {
    if (filter.text.length === 0) {
      return requestRows;
    }

    const text =
      filter.text.startsWith("/") && filter.text.length >= 2 && filter.text.endsWith("/")
        ? filter.text.slice(1, -1)
        : filter.text.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
    if (text === "") {
      return requestRows;
    }

    const regex = RegExp(text, filter.caseSensitive ? undefined : "i");
    return requestRows.filter(({ methodName }) => {
      return regex.test(methodName) === !filter.invert;
    });
  } catch (error) {
    return [];
  }
};
