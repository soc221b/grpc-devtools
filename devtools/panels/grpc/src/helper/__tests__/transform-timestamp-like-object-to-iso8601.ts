import { transformTimestampLikeObjectToISO8601 } from "../transform-timestamp-like-object-to-iso8601";

const suits: {
  title: string;
  parameters: Parameters<typeof transformTimestampLikeObjectToISO8601>;
  expect: ReturnType<typeof transformTimestampLikeObjectToISO8601>;
}[] = [
  {
    title: "empty object",
    parameters: [
      {},
    ],
    expect: {},
  },
  {
    title: "no transform",
    parameters: [
      { a: "b" },
    ],
    expect: { a: "b" },
  },
  {
    title: "transform",
    parameters: [
      { a: { seconds: 0, nanos: 0 } },
    ],
    expect: { a: "1970-01-01T00:00:00.000Z" },
  },
  {
    title: "nested",
    parameters: [
      {
        a: {
          b: {
            c: [
              { seconds: 946_782_245, nanos: 678_000_000 },
            ],
          },
        },
      },
    ],
    expect: {
      a: {
        b: {
          c: [
            "2000-01-02T03:04:05.678Z",
          ],
        },
      },
    },
  },
];

suits.forEach((suit) => {
  test(suit.title, () => {
    const actual = transformTimestampLikeObjectToISO8601(...suit.parameters);

    expect(actual).toEqual(suit.expect);
  });
});
