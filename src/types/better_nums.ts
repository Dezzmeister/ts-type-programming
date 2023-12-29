import { IsSame, Not, staticAssert } from "./assert";
/**
 * A natural number is represented by a non-empty array. The lowest natural number,
 * zero, is represented by the array [0], and the successor is [0,1], followed
 * by [0,1,2], etc.
 */
type Nat = [...number[], number];

type Z = [0];
// Successor
type S<T extends Nat> = [...T, T["length"]];
// Previous - P<Z> doesn't compile
type P<T extends S<Nat>> = T extends S<infer R> ? R : never;

staticAssert<IsSame<S<Z>, [0, 1]>>();
staticAssert<IsSame<S<S<Z>>, [0, 1, 2]>>();
staticAssert<IsSame<P<S<Z>>, Z>>();
staticAssert<IsSame<P<P<S<S<Z>>>>, Z>>();

// The actual value of a natural number. The last item in the natural number array
// is the "value"
type Val<T extends Nat> = T extends [...number[], infer R] ? R : never;

// This has the potential to recurse forever, if T is negative
type NumToNat<T extends number, N extends Nat> = N extends [
  ...number[],
  infer R
]
  ? T extends R
    ? N
    : NumToNat<T, S<N>>
  : never;

type NatOf<T extends number> = NumToNat<T, Z>;

staticAssert<IsSame<Val<Z>, 0>>();
staticAssert<IsSame<Val<S<Z>>, 1>>();
staticAssert<IsSame<Val<P<S<S<Z>>>>, 1>>();
staticAssert<IsSame<Val<S<S<Z>>>, 2>>();
staticAssert<IsSame<NatOf<5>, S<S<S<S<S<Z>>>>>>>();
staticAssert<IsSame<NatOf<0>, Z>>();

type LessThan<X extends Nat, Y extends Nat> = X extends S<infer XP>
  ? Y extends S<infer YP>
    ? LessThan<XP, YP>
    : false
  : Y extends Z
  ? false
  : true;

type GtrThan<X extends Nat, Y extends Nat> = LessThan<Y, X>;

type Eq<X extends Nat, Y extends Nat> = X extends Y
  ? Y extends X
    ? true
    : false
  : false;

staticAssert<LessThan<Z, S<Z>>>();
staticAssert<Not<LessThan<Z, Z>>>();
staticAssert<Not<LessThan<S<S<Z>>, S<Z>>>>();
staticAssert<LessThan<S<Z>, S<S<S<Z>>>>>();
staticAssert<GtrThan<S<Z>, Z>>();
staticAssert<Not<GtrThan<Z, Z>>>();
staticAssert<Not<GtrThan<S<Z>, S<S<Z>>>>>();
staticAssert<GtrThan<S<S<S<Z>>>, S<Z>>>();
staticAssert<Eq<Z, Z>>();
staticAssert<Eq<S<Z>, S<Z>>>();
staticAssert<Not<Eq<Z, S<Z>>>>();
staticAssert<Not<Eq<S<Z>, Z>>>();

type Leq<X extends Nat, Y extends Nat> = Eq<X, Y> extends true
  ? true
  : LessThan<X, Y>;
type Geq<X extends Nat, Y extends Nat> = Eq<X, Y> extends true
  ? true
  : GtrThan<X, Y>;
