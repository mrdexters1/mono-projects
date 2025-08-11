type Pipe<A, B> = (a: A, varName: string) => B;

interface Pipeline<A, B> {
  pipe<C>(fn: Pipe<B, C>): Pipeline<A, C>;
  run: Pipe<A, B>;
}

/**
 * @example
 * ```ts
 * const addOne = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const toString = (x: number) => x.toString();
 *
 * const result = pipe(asString)
 *   .pipe(asNumber)
 *   .pipe(asNumberWithBounds({ min: 0, max: 10 }))
 *   .run('5', 'varName'); // Pass the initial value here
 *
 * console.log(result); // Output: "12"
 * ```
 */
export const asPipe = <A, B>(fn: Pipe<A, B>): Pipeline<A, B> => ({
  pipe: <C>(nextFn: Pipe<B, C>): Pipeline<A, C> => asPipe((a: A, varName: string) => nextFn(fn(a, varName), varName)),
  run: (input: A, varName: string): B => fn(input, varName),
});
