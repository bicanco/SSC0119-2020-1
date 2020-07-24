import { tap } from 'rxjs/operators';

import { Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { instructions } from '../utils/instructions.utils';
import { getRegister } from '../utils/register.utils';
import { ClockService } from './clock.service';
import { KeyboardComponent } from './keyboard.component';
import { MemoryService } from './memory.service';
import { MultiplexComponent } from './multiplex.component';
import { RegisterComponent } from './register.component';
import { ScreenComponent } from './screen.component';
import { UlaService } from './ula.service';


@UntilDestroy()
@Component({
    selector: 'app-controller',
    templateUrl: 'controller.component.html',
})
export class ControllerComponent implements OnInit {

    @ViewChild('IR1', {read: RegisterComponent, static: true}) IR1: RegisterComponent;
    @ViewChild('IR2', {read: RegisterComponent, static: true}) IR2: RegisterComponent;
    @ViewChild('IR3', {read: RegisterComponent, static: true}) IR3: RegisterComponent;
    @ViewChild('R0', {read: RegisterComponent, static: true}) R0: RegisterComponent;
    @ViewChild('R1', {read: RegisterComponent, static: true}) R1: RegisterComponent;
    @ViewChild('R2', {read: RegisterComponent, static: true}) R2: RegisterComponent;
    @ViewChild('R3', {read: RegisterComponent, static: true}) R3: RegisterComponent;
    @ViewChild('R4', {read: RegisterComponent, static: true}) R4: RegisterComponent;
    @ViewChild('R5', {read: RegisterComponent, static: true}) R5: RegisterComponent;
    @ViewChild('R6', {read: RegisterComponent, static: true}) R6: RegisterComponent;
    @ViewChild('R7', {read: RegisterComponent, static: true}) R7: RegisterComponent;
    @ViewChild('FR', {read: RegisterComponent, static: true}) FR: RegisterComponent;
    @ViewChild('PC', {read: RegisterComponent, static: true}) PC: RegisterComponent;
    @ViewChild('SP', {read: RegisterComponent, static: true}) SP: RegisterComponent;
    @ViewChild('MAR', {read: RegisterComponent, static: true}) MAR: RegisterComponent;

    @ViewChild('M1', {read: MultiplexComponent, static: true}) M1: MultiplexComponent;
    @ViewChild('M2', {read: MultiplexComponent, static: true}) M2: MultiplexComponent;
    @ViewChild('M3', {read: MultiplexComponent, static: true}) M3: MultiplexComponent;
    @ViewChild('M4', {read: MultiplexComponent, static: true}) M4: MultiplexComponent;
    @ViewChild('M5', {read: MultiplexComponent, static: true}) M5: MultiplexComponent;
    @ViewChild('M6', {read: MultiplexComponent, static: true}) M6: MultiplexComponent;

    @ViewChild('KEYBOARD', {read: KeyboardComponent, static: true}) KEYBOARD: KeyboardComponent;
    @ViewChild('SCREEN', {read: ScreenComponent, static: true}) SCREEN: ScreenComponent;


    constructor(
        public readonly clock: ClockService,
        public readonly memory: MemoryService,
        public readonly ula: UlaService,
    ) {}

    ngOnInit() {
        this.memory.address = '0';
        this.clock.clock.pipe(
            untilDestroyed(this),
            tap(() => setTimeout(() => this.process())),
        ).subscribe();
    }

    private process() {
        this.resetControls();
        this.memory.print();

        const instruction1 = this.IR1.value;
        const instruction2 = this.IR2.value;
        const instruction3 = this.IR3.value;

        this.IR1.write = true;
        this.IR2.write = true;
        this.IR3.write = true;
        this.M1.select = 1;
        this.PC.increment = true;

        switch (instruction1.substring(0, 6)) {
            case instructions.store.code:
                this.MAR.write = true;
                this.IR1.reset = true;
                this.PC.increment = false;
                break;
            case instructions.load.code:
                this.MAR.write = true;
                this.IR1.reset = true;
                this.PC.increment = false;
                break;
            case instructions.noop.code:
                break;
        }

        switch (instruction2.substring(0, 6)) {
            case instructions.store.code:
                this.M1.select = 0;
                this.M3.select = 1;
                this.M5.select = 1;
                this.IR1.write = false;
                this.memory.write = true;
                break;
            case instructions.load.code:
                this.M1.select = 0;
                this.M2.select = 3;
                this.IR1.write = false;
                this[getRegister(instruction2.substring(6, 9))].write = true;
                break;
            case instructions.noop.code:
                break;
        }

        switch (instruction3.substring(0, 6)) {
            case instructions.store.code:
                break;
            case instructions.load.code:
                break;
            case instructions.noop.code:
                break;
        }

        this.simulateBus();

        console.log(this.IR1, this.IR2, this.PC, this.R0, this.MAR);
    }

    private resetControls() {
        this.R0.write = false;
        this.R0.increment = false;
        this.R0.reset = false;
        this.R1.write = false;
        this.R2.increment = false;
        this.R2.reset = false;
        this.R2.write = false;
        this.R2.increment = false;
        this.R2.reset = false;
        this.R3.write = false;
        this.R3.increment = false;
        this.R3.reset = false;
        this.R4.write = false;
        this.R4.increment = false;
        this.R4.reset = false;
        this.R5.write = false;
        this.R5.increment = false;
        this.R5.reset = false;
        this.R6.write = false;
        this.R6.increment = false;
        this.R6.reset = false;
        this.R7.write = false;
        this.R7.increment = false;
        this.R7.reset = false;

        this.FR.write = false;
        this.FR.increment = false;
        this.FR.reset = false;
        this.PC.write = false;
        this.PC.increment = false;
        this.PC.reset = false;
        this.SP.write = false;
        this.SP.increment = false;
        this.SP.reset = false;
        this.MAR.write = false;
        this.MAR.increment = false;
        this.MAR.reset = false;

        this.IR1.reset = false;
        this.IR1.write = false;
        this.IR1.increment = false;
        this.IR2.reset = false;
        this.IR2.write = false;
        this.IR2.increment = false;
        this.IR3.reset = false;
        this.IR3.write = false;
        this.IR3.increment = false;
        this.memory.write = false;
    }

    private simulateBus() {
        this.PC.value = this.memory.value;
        this.MAR.value = this.memory.value;
        this.IR1.value = this.memory.value;
        this.IR2.value = this.IR1.value;
        this.IR3.value = this.IR2.value;
    }
}
