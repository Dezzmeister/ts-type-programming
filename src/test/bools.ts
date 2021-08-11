export { True, False, Bit, If, IfNeg, And, Or, Not, Xor };

type True = 1;
type False = 0;

type Bit = True | False;

type If<Cond, True, False> = Cond extends True ? True : False;
type IfNeg<Cond, True, False> = Cond extends True ? False : True;

type And<Cond1, Cond2> = If<Cond1, Cond2, False>;
type Or<Cond1, Cond2> = If<Cond1, True, Cond2>;
type Not<Cond> = IfNeg<Cond, True, False>;
type Xor<Cond1, Cond2> = Or<And<Cond1, Not<Cond2>>, And<Cond2, Not<Cond1>>>;
