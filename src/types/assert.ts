export type IsSame<T, V> = [T] extends [V]
  ? [V] extends [T]
    ? true
    : false
  : false;

export type Not<T extends boolean> = T extends true ? false : true;

export declare function staticAssert<Cond extends true>(): void;
