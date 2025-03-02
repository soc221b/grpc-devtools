import React, { useEffect, useState } from "react";

const useIsFocusIn = ({
  ref,
  initialValue,
}: {
  ref: React.RefObject<HTMLElement>;
  initialValue: boolean;
}) => {
  const [isFocusIn, setIsFocusIn] = useState(initialValue);
  useEffect(() => {
    const handleFocus = () => {
      setIsFocusIn(true);
    };
    const handleBlur = () => {
      setIsFocusIn(false);
    };
    ref.current?.addEventListener("focusin", handleFocus);
    ref.current?.addEventListener("focusout", handleBlur);
    return () => {
      ref.current?.removeEventListener("focusin", handleFocus);
      ref.current?.removeEventListener("focusout", handleBlur);
    };
  }, [ref]);

  return isFocusIn;
};

export default useIsFocusIn;
