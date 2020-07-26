import { Injectable } from '@angular/core';

import { Operation } from '../utils/ula.utils';


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

    this.result_ = value(val1, val2, c).toString(2).padStart(16, '0');
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
}
