import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClockService } from './clock.service';
import { ControllerComponent } from './controller.component';
import { KeyboardComponent } from './keyboard.component';
import { MemoryService } from './memory.service';
import { MultiplexComponent } from './multiplex.component';
import { RegisterComponent } from './register.component';
import { ScreenComponent } from './screen.component';
import { UlaService } from './ula.service';


@NgModule({
  declarations: [
    ControllerComponent,
    KeyboardComponent,
    MultiplexComponent,
    RegisterComponent,
    ScreenComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    ClockService,
    MemoryService,
    UlaService,
  ],
  exports: [
    ControllerComponent,
  ],
})
export class SimulatorModule { }
