import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgStackFormsModule } from '@ng-stack/forms';

import { AppComponent } from './app.component';
import { FileInputDirective } from './file-input.directive';
import { SimulatorModule } from './simulator/simulator.module';


@NgModule({
  declarations: [
    AppComponent,
    FileInputDirective,
  ],
  imports: [
    BrowserModule,
    NgStackFormsModule,
    SimulatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
