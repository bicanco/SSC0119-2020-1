import { filter, tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ClockService } from './clock.service';


@UntilDestroy()
@Component({
  selector: 'app-register',
  template: '',
})
export class RegisterComponent implements OnInit {

  private value_ = '0000000000000000';
  private nextValue_ = '0000000000000000';
  private write_: boolean;
  private increment_: boolean;
  private reset_: boolean;

  get value() {
    return this.value_;
  }

  set value(value) {
    this.nextValue_ = value;
  }

  set write(value: boolean) {
    this.write_ = value;
  }

  set increment(value: boolean) {
    this.increment_ = value;
  }

  set reset(value: boolean) {
    this.reset_ = value;
  }

  constructor(
    private readonly clockService: ClockService,
  ) { }

  ngOnInit(): void {
    this.clockService.clock.pipe(
      untilDestroyed(this),
      filter(() => this.write_ || this.increment_ || this.reset_),
      tap(() => {
        if (this.reset_) {
          this.value_ = '0000000000000000';
        } else if (this.increment_) {
          this.value_ = ((parseInt(this.value_, 2) + 1 ) % 65536).toString(2).padStart(16, '0');
        } else {
          this.updateValue();
        }
      }),
    ).subscribe();
  }

  private updateValue(): void {
    this.value_ = this.nextValue_;
  }

}
