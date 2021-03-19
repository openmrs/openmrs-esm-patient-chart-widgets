import * as React from "react";

const makeThrottled = (func, time = 1000) => {
  let waiting = false;
  let toBeExecuted = false;
  let lastArgs = null;

  const throttledFunc = (...args) => {
    if (!waiting) {
      waiting = true;
      setTimeout(() => {
        waiting = false;
        if (toBeExecuted) {
          toBeExecuted = false;
          throttledFunc(...lastArgs);
        }
      }, time);
      func(...args);
    } else {
      toBeExecuted = true;
      lastArgs = args;
    }
  };

  return throttledFunc;
};

const useScrollIndicator = (xThreshold, yThreshold) => {
  const [xIsScrolled, setXIsScrolled] = React.useState(false);
  const [yIsScrolled, setYIsScrolled] = React.useState(false);

  const ref = React.useCallback(
    element => {
      if (!element) {
        return;
      }

      const scrollHandler = makeThrottled(() => {
        setXIsScrolled(element.scrollLeft > xThreshold);
        setYIsScrolled(element.scrollTop > yThreshold);
      }, 200);

      element.addEventListener("scroll", scrollHandler);
      return () => element.removeEventListener("scroll", scrollHandler);
    },
    [xThreshold, yThreshold]
  );

  return [xIsScrolled, yIsScrolled, ref] as [
    boolean,
    boolean,
    React.Ref<HTMLElement>
  ];
};

export default useScrollIndicator;
