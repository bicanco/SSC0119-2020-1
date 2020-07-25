import { Component, HostListener } from '@angular/core';


@Component({
  selector: 'app-keyboard',
  template: '',
})
export class KeyboardComponent {

  private value_: string;

  get value() {
    const key = this.value_;

    this.value_ = '0000000011111111';
    return key;
  }

  @HostListener('window:keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    this.value_ = event.key.charCodeAt(0).toString(2).padStart(16, '0');
  }
}
