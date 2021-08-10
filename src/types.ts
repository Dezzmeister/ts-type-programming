/**
 * Compile-time addition and other cool things with types in Typescript
 */


// Boolean algebra
type True = 1;
type False = 0;

type Bit = 1 | 0;

type If<Cond, True, False> = Cond extends True ? True : False;
type IfNeg<Cond, True, False> = Cond extends True ? False : True;

type And<Cond1, Cond2> = If<Cond1, Cond2, False>;
type Or<Cond1, Cond2> = If<Cond1, True, Cond2>;
type Not<Cond> = IfNeg<Cond, True, False>;
type Xor<Cond1, Cond2> = Or<And<Cond1, Not<Cond2>>, And<Cond2, Not<Cond1>>>;

// Full adder: A and B are input, C is carry-in
type FullAdder<A extends Bit, B extends Bit, C extends Bit> = {
    out: Xor<Xor<A, B>, C>;
    carry: Or<And<Xor<A, B> ,C>, And<A, B>>;
}

// Four-bit number
type Num4 = {
    "0": Bit;
    "1": Bit;
    "2": Bit;
    "3": Bit;
}

// Four-bit adder!
type Add4<N1 extends Num4, N2 extends Num4> = {
    "0": FullAdder<N1["0"], N2["0"], 0>["out"];
    "1": FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["out"];
    "2": FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["out"];
    "3": FullAdder<N1["3"], N2["3"], FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["carry"]>["out"];
}

// Eight-bit number
type Num8 = Num4 & Shl4<Num4>;

// Shift right 4
type Shr4<N extends Num8> = {
    "0": N["4"];
    "1": N["5"];
    "2": N["6"];
    "3": N["7"];
}

// Shift left 4
type Shl4<N extends Num4> = {
    "4": N["0"];
    "5": N["1"];
    "6": N["2"];
    "7": N["3"];
}

// 8 bit adder! It's defined in this ugly way so that Intellisense will resolve the fully-reduced type
// of the sum
type Add8<N1 extends Num8, N2 extends Num8> = {
    "0": FullAdder<N1["0"], N2["0"], 0>["out"];
    "1": FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["out"];
    "2": FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["out"];
    "3": FullAdder<N1["3"], N2["3"], FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["carry"]>["out"];
    "4": FullAdder<N1["4"], N2["4"], FullAdder<N1["3"], N2["3"], FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["carry"]>["carry"]>["out"];
    "5": FullAdder<N1["5"], N2["5"], FullAdder<N1["4"], N2["4"], FullAdder<N1["3"], N2["3"], FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["carry"]>["carry"]>["carry"]>["out"];
    "6": FullAdder<N1["6"], N2["6"], FullAdder<N1["5"], N2["5"], FullAdder<N1["4"], N2["4"], FullAdder<N1["3"], N2["3"], FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["carry"]>["carry"]>["carry"]>["carry"]>["out"];
    "7": FullAdder<N1["7"], N2["7"], FullAdder<N1["6"], N2["6"], FullAdder<N1["5"], N2["5"], FullAdder<N1["4"], N2["4"], FullAdder<N1["3"], N2["3"], FullAdder<N1["2"], N2["2"], FullAdder<N1["1"], N2["1"], FullAdder<N1["0"], N2["0"], 0>["carry"]>["carry"]>["carry"]>["carry"]>["carry"]>["carry"]>["carry"]>["out"];
};

// Zero literal
type Zero = {
    "0": 0;
    "1": 0;
    "2": 0;
    "3": 0;
    "4": 0;
    "5": 0;
    "6": 0;
    "7": 0;
}

// 8-bit bitwise or
type BitOr8<N1 extends Num8, N2 extends Num8> = {
    [P in keyof (N1 | N2)]: Or<N1[P], N2[P]>;
}

// Set bits on a Num8 type. N1 is the full Num8, and BS is an object with the
// bits to set.
type SetBits<N1 extends Num8, BS extends Partial<Num8>> = {
    [R in keyof (Omit<N1, keyof BS>)]: N1[R];
} & {
    [K in keyof BS]: BS[K];
}

// Set bits on Zero
type ZeroWith<N extends Partial<Num8>> = SetBits<Zero, N>;

// 2 raised to different powers
type Exp2To0 = ZeroWith<{"0": 1}>;
type Exp2To1 = ZeroWith<{"1": 1}>;
type Exp2To2 = ZeroWith<{"2": 1}>;
type Exp2To3 = ZeroWith<{"3": 1}>;
type Exp2To4 = ZeroWith<{"4": 1}>;
type Exp2To5 = ZeroWith<{"5": 1}>;
type Exp2To6 = ZeroWith<{"6": 1}>;
type Exp2To7 = ZeroWith<{"7": 1}>;

type IsOdd<N extends Num8> = N["0"] extends True ? True : False;
type IsEven<N extends Num8> = Not<IsOdd<N>>;
