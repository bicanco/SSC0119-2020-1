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
    ZERO = 8,
}


export const conditions: {[key: string]: string}  = {
    unconditional: '0000',
    equal: '0001',
    notEqual: '0010',
    zero: '0011',
    notZero: '0100',
    carry: '0101',
    notCarry: '0110',
    greater: '0111',
    lesser: '1000',
    equalOrGreater: '1001',
    equalOrLesser: '1010',
    overflow: '1011',
    notOverflow: '1100',
    negative: '1101',
    divByZero: '1110',
};

export const conditionsCheck = new Map<string, (flags: string) => boolean>([
    [conditions.unconditional, (flag) => true],
    [conditions.equal, (flag) => !!+flag[UlaFlags.EQUAL]],
    [conditions.notEqual, (flag) => !+flag[UlaFlags.EQUAL]],
    [conditions.zero, (flag) => !!+flag[UlaFlags.ZERO]],
    [conditions.notZero, (flag) => !+flag[UlaFlags.ZERO]],
    [conditions.carry, (flag) => !!+flag[UlaFlags.CARRY]],
    [conditions.notCarry, (flag) => !+flag[UlaFlags.CARRY]],
    [conditions.greater, (flag) => !!+flag[UlaFlags.GREATER]],
    [conditions.lesser, (flag) => !!+flag[UlaFlags.LESSER]],
    [conditions.equalOrGreater, (flag) => !!+flag[UlaFlags.GREATER] || !!+flag[UlaFlags.EQUAL]],
    [conditions.equalOrLesser, (flag) => !!+flag[UlaFlags.LESSER] || !!+flag[UlaFlags.EQUAL]],
    [conditions.overflow, (flag) => !!+flag[UlaFlags.OVERFLOW]],
    [conditions.notOverflow, (flag) => !+flag[UlaFlags.OVERFLOW]],
    [conditions.negative, (flag) => !!+flag[UlaFlags.NEGATIVE]],
    [conditions.divByZero, (flag) => !!+flag[UlaFlags.DIVBYZERO]],
]);
