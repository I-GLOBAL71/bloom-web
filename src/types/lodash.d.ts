declare module 'lodash' {
  import { DebouncedFunc } from 'lodash';
  // Add specific type declarations if needed
  export function debounce<T extends (...args: any[]) => any>(func: T, wait?: number, options?: object): DebouncedFunc<T>;
  // Add other lodash function types as needed
}
