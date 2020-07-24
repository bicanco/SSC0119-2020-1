import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl } from '@ng-stack/forms';


@Directive({
  selector: '[appFileInput]',
})
export class FileInputDirective {

  @Input() control: FormControl;
  @Output() file = new EventEmitter<File>();

  @HostListener('window:input', ['$event'])
  chooseFile(event) {
    const file = event.target.files[0];
    this.control.setValue(file.name);
    this.file.emit(file);
  }
}
