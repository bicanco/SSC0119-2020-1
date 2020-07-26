import { instructions } from './instructions.utils';


export type Operation = (value1: number, value2: number, carry: number) => number;

export const ulaOperations = new Map<string, Operation>([
    [instructions.add.code, (value1, value2, carry) => value1 + value2 + carry],
    [instructions.sub.code, (value1, value2, carry) => (value1 + (65536 - value2) + carry) % 65536],
    [instructions.mult.code, (value1, value2, carry) => value1 * value2 + carry],
    [instructions.div.code, (value1, value2, carry) => Math.floor(value1 / value2) + carry],
    [instructions.mod.code, (value1, value2) => value1 % value2],
]);
