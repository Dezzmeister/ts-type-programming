import { Bit, Xor, Or, And, Not } from "./bools";
export {
	DecMap,
	IncMap,
	LastBitZero,
	Zero,
	One,
	FA1,
	NumN,
	FAN,
	Add,
	Neg,
	Sub,
	Mul,
	ZeroWith,
	BitwAnd,
	BitwOr,
	BitwXor,
	BitwNot,
	Shl,
	Shr,
	Fac,
};

// Structure mapping bit positions to the ones before them. Used to recurse
// through a type representing a binary number or an analog of one. Add keys to this
// type to extend the capabilities of these type-numbers to greater numbers.
type DecMap = {
	0: 0;
	1: 0;
	2: 1;
	3: 2;
	4: 3;
	5: 4;
	6: 5;
	7: 6;
	8: 7;
	9: 8;
	10: 9;
	11: 10;
	12: 11;
	13: 12;
	14: 13;
	15: 14;
};

type IncMap = {
	0: 1;
	1: 2;
	2: 3;
	3: 4;
	4: 5;
	5: 6;
	7: 8;
	8: 9;
	9: 10;
	10: 11;
	11: 12;
	12: 13;
	13: 14;
	14: 15;
	15: 0;
};

type LastBitZero<N extends NumN> = N & {
	15: 0;
};

type Zero = {
	[D in keyof DecMap]: 0;
};

type One = ZeroWith<{ 0: 1 }>;

// Full adder (1 bit): A and B are input, C is carry-in
type FA1<A extends Bit, B extends Bit, C extends Bit> = {
	out: Xor<Xor<A, B>, C>;
	carry: Or<And<Xor<A, B>, C>, And<A, B>>;
};

// Binary number of N bits
type NumN = {
	[T in keyof DecMap]: Bit;
};

// Full adder for N-bit numbers
type FAN<D extends keyof DecMap, N1 extends NumN, N2 extends NumN> = D extends 0
	? FA1<N1[D], N2[D], 0>
	: FA1<N1[D], N2[D], FAN<DecMap[D], N1, N2>["carry"]>;

// N-bit adder
type Add<N1 extends NumN, N2 extends NumN> = {
	[D in keyof NumN]: FAN<D, N1, N2>["out"];
};

// Convert a number to a two's complement negative
type Neg<N extends NumN> = Add<BitwNot<N>, One>;

// N-bit subtractor. Implemented by adding the first number to the negation
// of the second.
type Sub<N1 extends NumN, N2 extends NumN> = Add<N1, Neg<N2>>;

// TODO: Support negative operands and modify ts compiler type recursion limit
type Mul<N1 extends NumN, N2 extends NumN> = N1 extends Zero
	? Zero
	: N2 extends Zero
	? Zero
	: Add<N1, Mul<N1, Sub<N2, One>>>;

type ZeroWith<N extends Partial<NumN>> = Omit<Zero, keyof N> & N;

type BitwAnd<N1 extends NumN, N2 extends NumN> = {
	[D in keyof NumN]: And<N1[D], N2[D]>;
};

type BitwOr<N1 extends NumN, N2 extends NumN> = {
	[D in keyof NumN]: Or<N1[D], N2[D]>;
};

type BitwXor<N1 extends NumN, N2 extends NumN> = {
	[D in keyof NumN]: Xor<N1[D], N2[D]>;
};

type BitwNot<N extends NumN> = {
	[D in keyof NumN]: Not<N[D]>;
};

type Shl<N extends NumN> = {
	[D in keyof DecMap]: D extends 0 ? 0 : N[DecMap[D]];
};

type Shr<N extends NumN> = LastBitZero<N> &
	{
		[D in keyof IncMap]: IncMap[D];
	};

// Factorial function
type Fac<N extends NumN> = N extends One ? One : Mul<N, Sub<N, One>>;
