import * as React from "react";

const makeThrottled = <T extends (...args: any[]) => any>(
  func: T,
  time = 1000
): ((...funcArgs: Parameters<T>) => void) => {
  let waiting = false;
  let toBeExecuted = false;
  let lastArgs: Parameters<T> = null;

  const throttledFunc = (...args: Parameters<T>) => {
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

const useScrollIndicator = (
  xThreshold: number,
  yThreshold: number
): [boolean, boolean, React.Ref<HTMLElement>] => {
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

  return [xIsScrolled, yIsScrolled, ref];
};

export default useScrollIndicator;
