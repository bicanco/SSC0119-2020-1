import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-multiplex',
  template: '',
})
export class MultiplexComponent {
  private selected_: string | number = 0;

  @Input() inputDevices: Array<any>;
  @Output() outputDevice: EventEmitter<string> = new EventEmitter<string>();

  set select(value: string | number) {
    this.selected_ = value;
    this.outputDevice.emit(this.inputDevices[value].value);
  }

  get value() {
    return this.inputDevices[this.selected_].value;
  }

}
