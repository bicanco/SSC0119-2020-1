import { tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ng-stack/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
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
        break;
    }
  }


}
