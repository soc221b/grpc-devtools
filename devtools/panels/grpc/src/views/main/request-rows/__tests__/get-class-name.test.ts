import { getClassName } from "../get-class-name";

const suits: {
  title: string;
  parameters: Parameters<typeof getClassName>;
  expect: ReturnType<typeof getClassName>;
}[] = [
  {
    title: "none",
    parameters: [
      {
        isWindowFocus: false,
        isActive: false,
        isError: false,
        isOdd: false,
      },
    ],
    expect: ["text-[#303942] dark:text-[#bec6cf]", "bg-[#f5f5f5] dark:bg-[#292929]"],
  },
  {
    title: "isOdd",
    parameters: [
      {
        isWindowFocus: false,
        isActive: false,
        isError: false,
        isOdd: true,
      },
    ],
    expect: ["text-[#303942] dark:text-[#bec6cf]", "bg-[#ffffff] dark:bg-[#242424]"],
  },
  {
    title: "isError",
    parameters: [
      {
        isWindowFocus: false,
        isActive: false,
        isError: true,
        isOdd: false,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#f5f5f5] dark:bg-[#292929]"],
  },
  {
    title: "isError, isOdd",
    parameters: [
      {
        isWindowFocus: false,
        isActive: false,
        isError: true,
        isOdd: true,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#ffffff] dark:bg-[#242424]"],
  },
  {
    title: "isActive",
    parameters: [
      {
        isWindowFocus: false,
        isActive: true,
        isError: false,
        isOdd: false,
      },
    ],
    expect: ["text-[#303942] dark:text-[#bec6cf]", "bg-[#dadcd0] dark:bg-[#454545]"],
  },
  {
    title: "isActive, isOdd",
    parameters: [
      {
        isWindowFocus: false,
        isActive: true,
        isError: false,
        isOdd: true,
      },
    ],
    expect: ["text-[#303942] dark:text-[#bec6cf]", "bg-[#dadcd0] dark:bg-[#454545]"],
  },
  {
    title: "isActive, isError",
    parameters: [
      {
        isWindowFocus: false,
        isActive: true,
        isError: true,
        isOdd: false,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#dadcd0] dark:bg-[#454545]"],
  },
  {
    title: "isActive, isError, isOdd",
    parameters: [
      {
        isWindowFocus: false,
        isActive: true,
        isError: true,
        isOdd: true,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#dadcd0] dark:bg-[#454545]"],
  },
  {
    title: "isWindowFocus",
    parameters: [
      {
        isWindowFocus: true,
        isActive: false,
        isError: false,
        isOdd: false,
      },
    ],
    expect: ["text-[#303942] dark:text-[#bec6cf]", "bg-[#f5f5f5] dark:bg-[#292929]"],
  },
  {
    title: "isWindowFocus, isOdd",
    parameters: [
      {
        isWindowFocus: true,
        isActive: false,
        isError: false,
        isOdd: true,
      },
    ],
    expect: ["text-[#303942] dark:text-[#bec6cf]", "bg-[#ffffff] dark:bg-[#242424]"],
  },
  {
    title: "isWindowFocus, isError",
    parameters: [
      {
        isWindowFocus: true,
        isActive: false,
        isError: true,
        isOdd: false,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#f5f5f5] dark:bg-[#292929]"],
  },
  {
    title: "isWindowFocus, isError, isOdd",
    parameters: [
      {
        isWindowFocus: true,
        isActive: false,
        isError: true,
        isOdd: true,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#ffffff] dark:bg-[#242424]"],
  },
  {
    title: "isWindowFocus, isActive",
    parameters: [
      {
        isWindowFocus: true,
        isActive: true,
        isError: false,
        isOdd: false,
      },
    ],
    expect: ["text-[#ffffff] dark:text-[#cdcdcd]", "bg-[#1b73e8] dark:bg-[#10629d]"],
  },
  {
    title: "isWindowFocus, isActive, isOdd",
    parameters: [
      {
        isWindowFocus: true,
        isActive: true,
        isError: false,
        isOdd: true,
      },
    ],
    expect: ["text-[#ffffff] dark:text-[#cdcdcd]", "bg-[#1b73e8] dark:bg-[#10629d]"],
  },
  {
    title: "isWindowFocus, isActive, isError",
    parameters: [
      {
        isWindowFocus: true,
        isActive: true,
        isError: true,
        isOdd: false,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#fad2cf] dark:bg-[#482422]"],
  },
  {
    title: "isWindowFocus, isActive, isError, isOdd",
    parameters: [
      {
        isWindowFocus: true,
        isActive: true,
        isError: true,
        isOdd: true,
      },
    ],
    expect: ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#fad2cf] dark:bg-[#482422]"],
  },
];

describe("getClassName", () => {
  suits.forEach((suit) => {
    test(suit.title, () => {
      const actual = getClassName(...suit.parameters);
      expect(actual).toEqual(suit.expect);
    });
  });
});
