import { Injectable } from '@angular/core';


@Injectable()
export class UlaService {
  private value1_: number;
  private value2_: number;
  private op_: any;
  private flag_: any;

  set value1(value) {
    this.value1_ = value;
  }

  set value2(value) {
    this.value2_ = value;
  }

  set op(value) {

  }

  get flag() {
    return this.flag_;
  }

  set flag(value) {
    this.flag_ = value;
  }

  get value() {
    return this.op_(this.value1_, this.value2_);
  }
}
