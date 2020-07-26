import { instructions } from './instructions.utils';


export type Operation = (value1: number, value2: number, carry: number) => number;

export const ulaOperations = new Map<string, Operation>([
    [instructions.add.code, (value1, value2, carry) => value1 + value2 + carry],
    [instructions.sub.code, (value1, value2, carry) => value1 - value2 + carry],
    [instructions.mult.code, (value1, value2, carry) => value1 * value2 + carry],
    [instructions.div.code, (value1, value2, carry) => Math.floor(value1 / value2) + carry],
    [instructions.mod.code, (value1, value2) => value1 % value2],
    [instructions.and.code, (value1, value2) => value1 & value2],
    [instructions.or.code, (value1, value2) => value1 | value2],
    [instructions.xor.code, (value1, value2) => value1 ^ value2],
    [instructions.not.code, (value1) => parseInt((~value1 >>> 0).toString(2).slice(-16), 2)],
    [instructions.cmp.code, () => null],
]);


export enum UlaFlags {
    CARRY = 15,
    EQUAL = 14,
    LESSER = 13,
    GREATER = 12,
    OVERFLOW = 11,
    NEGATIVE = 10,
    DIVBYZERO = 9,
}
