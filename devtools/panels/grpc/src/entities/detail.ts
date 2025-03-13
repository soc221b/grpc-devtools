export type Detail = {
  tab: (typeof tabs)[number];
  requestId: null | string;
  messages: {
    focusedIndex: null | number;
    isPreview: boolean;
    isISO8601: boolean;
    isStickyScroll: boolean;
  };
};

export const tabs = ["headers", "messages"] as const;
