import { Filter } from "@/entities/filter";
import { RequestRow } from "@/entities/request-row";
import { filterRequestRows } from "../filter-request-rows";

const requestRow1: RequestRow = {
  id: "1",
  messages: [],
  methodName: "dummyMethod$1",
  requestMetadata: {},
  serviceName: "dummyService",
};
const requestRow2: RequestRow = {
  id: "2",
  messages: [],
  methodName: "dummyMethod$2",
  requestMetadata: {},
  serviceName: "dummyService",
};
const requestRow3: RequestRow = {
  id: "3",
  messages: [],
  methodName: "DummyMethod$3",
  requestMetadata: {},
  serviceName: "dummyService",
};
const requestRows = [requestRow1, requestRow2, requestRow3];

const suits: {
  id: string;
  parameter: Parameters<typeof filterRequestRows>[0];
  expect: ReturnType<typeof filterRequestRows>;
}[] = [
  {
    id: "text 0",
    parameter: {
      requestRows,
      filter: {
        text: "",
        caseSensitive: false,
        invert: false,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "text 1",
    parameter: {
      requestRows,
      filter: {
        text: "",
        caseSensitive: false,
        invert: true,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "text 2",
    parameter: {
      requestRows,
      filter: {
        text: "",
        caseSensitive: true,
        invert: false,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "text 3",
    parameter: {
      requestRows,
      filter: {
        text: "",
        caseSensitive: true,
        invert: true,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "text 4",
    parameter: {
      requestRows,
      filter: {
        text: "dummyMethod$1",
        caseSensitive: false,
        invert: false,
      },
    },
    expect: [requestRow1],
  },
  {
    id: "text 5",
    parameter: {
      requestRows,
      filter: {
        text: "dummyMethod$1",
        caseSensitive: false,
        invert: true,
      },
    },
    expect: [requestRow2, requestRow3],
  },
  {
    id: "text 6",
    parameter: {
      requestRows,
      filter: {
        text: "dummyMethod",
        caseSensitive: true,
        invert: false,
      },
    },
    expect: [requestRow1, requestRow2],
  },
  {
    id: "text 7",
    parameter: {
      requestRows,
      filter: {
        text: "dummyMethod",
        caseSensitive: true,
        invert: true,
      },
    },
    expect: [requestRow3],
  },
  {
    id: "regex 0",
    parameter: {
      requestRows,
      filter: {
        text: "//",
        caseSensitive: false,
        invert: false,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "regex 1",
    parameter: {
      requestRows,
      filter: {
        text: "//",
        caseSensitive: false,
        invert: true,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "regex 2",
    parameter: {
      requestRows,
      filter: {
        text: "//",
        caseSensitive: true,
        invert: false,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "regex 3",
    parameter: {
      requestRows,
      filter: {
        text: "//",
        caseSensitive: true,
        invert: true,
      },
    },
    expect: [requestRow1, requestRow2, requestRow3],
  },
  {
    id: "regex 4",
    parameter: {
      requestRows,
      filter: {
        text: "/dummyMethod\\$1/",
        caseSensitive: false,
        invert: false,
      },
    },
    expect: [requestRow1],
  },
  {
    id: "regex 5",
    parameter: {
      requestRows,
      filter: {
        text: "/dummyMethod\\$1/",
        caseSensitive: false,
        invert: true,
      },
    },
    expect: [requestRow2, requestRow3],
  },
  {
    id: "regex 6",
    parameter: {
      requestRows,
      filter: {
        text: "/^D/",
        caseSensitive: true,
        invert: false,
      },
    },
    expect: [requestRow3],
  },
  {
    id: "regex 7",
    parameter: {
      requestRows,
      filter: {
        text: "/^D/",
        caseSensitive: true,
        invert: true,
      },
    },
    expect: [requestRow1, requestRow2],
  },
  {
    id: "invalid regex",
    parameter: {
      requestRows,
      filter: {
        text: "/(/",
        caseSensitive: false,
        invert: false,
      },
    },
    expect: [],
  },
  {
    id: "other 1",
    parameter: {
      requestRows,
      filter: {
        text: "1$",
        caseSensitive: false,
        invert: false,
      },
    },
    expect: [],
  },
  {
    id: "other 2",
    parameter: {
      requestRows,
      filter: {
        text: "$1",
        caseSensitive: false,
        invert: false,
      },
    },
    expect: [requestRow1],
  },
];

suits.forEach((suit) => {
  test(suit.id, () => {
    const actual = filterRequestRows(suit.parameter);

    expect(actual).toEqual(suit.expect);
  });
});
