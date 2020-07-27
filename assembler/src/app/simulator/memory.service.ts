import { Injectable } from '@angular/core';

@Injectable()
export class MemoryService {
  private memory_ = new Array<string>();
  private address_: number;
  private write_: boolean;
  private value_: string;
  private valueToWrite_: string;

  set address(value: string) {
    this.address_ = parseInt(value, 2);
    if (this.write_) {
      this.memory_[this.address_] = this.valueToWrite_;
    } else {
      this.value_ = this.memory_[this.address_];
    }
  }

  set write(value: boolean) {
    this.write_ = value;
    if (this.write_) {
      this.memory_[this.address_] = this.valueToWrite_;
    } else {
      this.value_ = this.memory_[this.address_];
    }
  }

  set value(value: string) {
    this.valueToWrite_ = value;
    if (this.write_) {
      this.memory_[this.address_] = this.valueToWrite_;
    }
  }

  get value() {
    return this.value_ ?? '0000000000000000';
  }

  print() {
    console.log(this.memory_);
  }

  initMemory(memory: Array<string>) {
    this.memory_ = memory;
  }

}
