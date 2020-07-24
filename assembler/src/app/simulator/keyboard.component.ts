import { Component } from '@angular/core';


@Component({
  selector: 'app-keyboard',
  template: '',
})
export class KeyboardComponent {

  private value_: string;

  get value() {
    return this.value_;
  }
}
