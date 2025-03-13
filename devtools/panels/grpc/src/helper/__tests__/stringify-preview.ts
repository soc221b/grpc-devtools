import { stringifyPreview } from "../stringify-preview";

const suits: {
  title: string;
  parameters: Parameters<typeof stringifyPreview>;
  expect: ReturnType<typeof stringifyPreview>;
}[] = [
  {
    title: "null",
    parameters: [
      null,
      100,
    ],
    expect: `null`,
  },
  {
    title: "null in array",
    parameters: [
      [
        null,
      ],
      100,
    ],
    expect: `[null]`,
  },
  {
    title: "null in object",
    parameters: [
      { key: null },
      100,
    ],
    expect: `{"key":null}`,
  },
  {
    title: "boolean",
    parameters: [
      true,
      100,
    ],
    expect: `true`,
  },
  {
    title: "boolean in array",
    parameters: [
      [
        true,
      ],
      100,
    ],
    expect: `[true]`,
  },
  {
    title: "boolean in object",
    parameters: [
      { key: true },
      100,
    ],
    expect: `{"key":true}`,
  },
  {
    title: "number",
    parameters: [
      42,
      100,
    ],
    expect: `42`,
  },
  {
    title: "number in array",
    parameters: [
      [
        42,
      ],
      100,
    ],
    expect: `[42]`,
  },
  {
    title: "number in object",
    parameters: [
      { key: 42 },
      100,
    ],
    expect: `{"key":42}`,
  },
  {
    title: "string empty",
    parameters: [
      "",
      100,
    ],
    expect: `""`,
  },
  {
    title: "string",
    parameters: [
      "foo",
      100,
    ],
    expect: `"foo"`,
  },
  {
    title: "string in array",
    parameters: [
      [
        "foo",
      ],
      100,
    ],
    expect: `["foo"]`,
  },
  {
    title: "string in object",
    parameters: [
      { key: "foo" },
      100,
    ],
    expect: `{"key":"foo"}`,
  },
  {
    title: "array empty",
    parameters: [
      [],
      100,
    ],
    expect: `[]`,
  },
  {
    title: "array",
    parameters: [
      [
        true,
        42,
        { key: "foo" },
      ],
      100,
    ],
    expect: `[true,42,{"key":"foo"}]`,
  },
  {
    title: "array length",
    parameters: [
      [
        11,
        22,
        33,
      ],
      4,
    ],
    expect: `[11]`,
  },
  {
    title: "array greedy",
    parameters: [
      [
        11,
        22,
        33,
      ],
      5,
    ],
    expect: `[11,22]`,
  },
  {
    title: "object empty",
    parameters: [
      {},
      100,
    ],
    expect: `{}`,
  },
  {
    title: "object",
    parameters: [
      {
        key: [
          true,
          42,
          "foo",
        ],
      },
      100,
    ],
    expect: `{"key":[true,42,"foo"]}`,
  },
  {
    title: "object length",
    parameters: [
      { a: 1, b: 2, c: 3 },
      7,
    ],
    expect: `{"a":1}`,
  },
  {
    title: "object greedy",
    parameters: [
      { a: 1, b: 2, c: 3 },
      8,
    ],
    expect: `{"a":1,"b":2}`,
  },
];

suits.forEach((suit) => {
  test(suit.title, () => {
    const actual = stringifyPreview(...suit.parameters);

    expect(actual).toEqual(suit.expect);
  });
});
