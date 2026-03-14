export interface DebouncedFunction<T extends readonly unknown[]> {
  readonly call: (...args: T) => void;
  readonly cancel: () => void;
}

export function debounce<T extends readonly unknown[]>(
  fn: (...args: T) => void,
  delay: number
): DebouncedFunction<T> {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const call = (...args: T): void => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, delay);
  };

  const cancel = (): void => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return { call, cancel };
}
