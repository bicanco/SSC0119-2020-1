import { tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ng-stack/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MemoryService } from './simulator/memory.service';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [MemoryService],
})
export class AppComponent implements OnInit {

  buttonLabel: string;
  form: FormGroup = new FormGroup({
    source: new FormControl<string>(),
  });

  simulate: boolean;
  downloadFile: boolean;
  showButtons: boolean;
  file: File;

  constructor(
    private readonly memory: MemoryService,
  ) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      untilDestroyed(this),
      tap(value => {
        const fileExtension = /\.(mif|asm)$/.exec(value.source)?.[1] ?? '';
        this.downloadFile = false;

        switch (fileExtension) {
          case 'asm':
            this.showButtons = true;
            this.buttonLabel = 'Compile';
            break;
          case 'mif':
            this.showButtons = true;
            this.buttonLabel = 'Simulate';
            break;
          default:
            this.form.setErrors({
              fileFormat: true,
            });
            this.showButtons = false;
            break;
        }
      }),
    ).subscribe();
  }

  submit() {
    switch (this.buttonLabel) {
      case 'Compile':
        this.downloadFile = true;
        break;
      case 'Simulate':
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const initalValue = new Array<string>();
          const lines = (fileReader.result as string).split('\n');

          for(let i = 6; i < lines.length - 2; i++) {
            const value = /\d+:((?:0|1){16});/.exec(lines[i])?.[1];
            if (value && value !== '0000000000000000') {
              initalValue[i - 6] = value;
            }
          }

          this.memory.initMemory(initalValue);
        }

        console.log(this.file);
        fileReader.readAsText(this.file);
        break;
    }
  }


}
