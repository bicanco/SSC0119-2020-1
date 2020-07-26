import { Injectable } from '@angular/core';

import { instructions } from '../utils/instructions.utils';
import { Operation, UlaFlags, ulaOperations } from '../utils/ula.utils';


@Injectable()
export class UlaService {
  private value1_: string;
  private value2_: string;
  private carry_: string;
  private result_: string;
  private useCarry_: string;
  private flags_ = '0000000000000000';

  set value1(value: string) {
    this.value1_ = value;
  }

  set value2(value: string) {
    this.value2_ = value;
  }

  set op(value: Operation) {
    const val1 = parseInt(this.value1_, 2);
    const val2 = parseInt(this.value2_, 2);
    const c = parseInt(this.carry_, 2) & parseInt(this.useCarry_, 2);

    const result = value(val1, val2, c);
    const isAddOrSub =
      value === ulaOperations.get(instructions.add.code)
      || value === ulaOperations.get(instructions.sub.code);

    this.setFlags(result, isAddOrSub);

    this.result_ = result === Infinity ? '0000000000000000' : (result >>> 0).toString(2).padStart(16, '0').slice(-16);
  }

  get flags() {
    return this.flags_;
  }

  set carry(value: string) {
    this.carry_ = value;
  }

  set useCarry(value: string) {
    this.useCarry_ = value;
  }

  get value() {
    return this.result_;
  }

  private setFlags(result: number, mayHaveCarry: boolean) {
    let aux = '000000000';

    aux += result === Infinity ? '1' : '0';
    aux += result < 0 ? '1' : '0';
    aux += result > 65535 && result !== Infinity ? '1' : '0';
    aux += result === null ? this.value1_ > this.value2_ ? '1' : '0' : this.flags_[UlaFlags.GREATER];
    aux += result === null ? this.value1_ < this.value2_ ? '1' : '0' : this.flags_[UlaFlags.LESSER];
    aux += result === null ? this.value1_ === this.value2_ ? '1' : '0' : this.flags_[UlaFlags.EQUAL];
    aux += mayHaveCarry ? result > 65535 || this.value1_ < this.value2_ ? '1' : '0' : this.flags_[UlaFlags.CARRY];

    this.flags_ = aux;
  }
}
