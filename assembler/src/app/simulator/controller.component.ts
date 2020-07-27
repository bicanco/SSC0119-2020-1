import { tap } from 'rxjs/operators';

import { Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { instructions } from '../utils/instructions.utils';
import {
    M1Options, M2Options, M3Options, M4Options, M5Options, M6Options,
} from '../utils/multiplex.utils';
import { getRegister } from '../utils/register.utils';
import { conditionsCheck, GetUlaFlags, ulaOperations } from '../utils/ula.utils';
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
    getUlaFlags: GetUlaFlags;

    constructor(
        public readonly clock: ClockService,
        public readonly memory: MemoryService,
        public readonly ula: UlaService,
    ) {
        this.getUlaFlags = new GetUlaFlags(ula);
    }

    ngOnInit() {
        this.memory.address = '0';
        this.clock.clock.pipe(
            untilDestroyed(this),
            tap(() => setTimeout(() => this.process())),
        ).subscribe();
    }

    private process() {
        this.simulateBus1();
        this.resetControls();
        this.memory.print();

        const instruction1 = this.IR1.value;
        const instruction2 = this.IR2.value;

        this.IR1.write = true;
        this.M1.select = M1Options.PC;
        this.PC.increment = true;

        switch (instruction1.substring(0, 6)) {
            case instructions.store.code:
                this.MAR.write = true;
                this.IR1.reset = true;
                this.PC.increment = false;
                this.IR2.write = true;
                break;
            case instructions.storei.code:
                this.M4.select = M4Options[getRegister(instruction1.substring(9, 12))];
                this.M3.select = M3Options[getRegister(instruction1.substring(6, 9))];
                this.M1.select = M1Options.M4;
                this.M5.select = M5Options.M3;
                this.memory.write = true;
                this.PC.increment = false;
                this.IR1.reset = true;
                break;
            case instructions.load.code:
                this.MAR.write = true;
                this.IR1.reset = true;
                this.PC.increment = false;
                this.IR2.write = true;
                break;
            case instructions.loadi.code:
                this.M4.select = M4Options[getRegister(instruction1.substring(9, 12))];
                this.M1.select = M1Options.M4;
                this.M2.select = M2Options.memory;
                this[getRegister(instruction1.substring(6, 9))].write = true;
                break;
            case instructions.loadn.code:
                this.M2.select = M2Options.memory;
                this[getRegister(instruction1.substring(6, 9))].write = true;
                this.IR1.reset = true;
                break;
            case instructions.mov.code:
                switch (instruction1.substring(14, 16)) {
                    case '01':
                        this.M2.select = M2Options.SP;
                        this[getRegister(instruction1.substring(6, 9))].write = true;
                        break;
                    case '11':
                        this.M4.select = M4Options[getRegister(instruction1.substring(6, 9))];
                        this.SP.write = true;
                        break;
                    case '00':
                    case '10':
                        this.M4.select = M4Options[getRegister(instruction1.substring(9, 12))];
                        this.M2.select = M2Options.M4;
                        this[getRegister(instruction1.substring(6, 9))].write = true;
                        break;
                }
                break;
            case instructions.add.code:
            case instructions.sub.code:
            case instructions.mult.code:
            case instructions.div.code:
            case instructions.mod.code:
            case instructions.and.code:
            case instructions.or.code:
            case instructions.xor.code:
            case instructions.not.code:
                this.M3.select = M3Options[getRegister(instruction1.substring(9, 12))];
                this.M4.select = M4Options[getRegister(instruction1.substring(12, 15))];
                this.ula.useCarry = instruction1.substring(15, 16);
                this.ula.op = ulaOperations.get(instruction1.substring(0, 6));
                this.M2.select = M2Options.ula;
                this[getRegister(instruction1.substring(6, 9))].write = true;
                this.M6.select = M6Options.ula_flag;
                this.FR.write = true;
                break;
            case instructions.inc.code:
                this.M3.select = M3Options[getRegister(instruction1.substring(6, 9))];
                this.M4.select = M4Options.VALUE_1;
                this.ula.op = instruction1.substring(9, 10) === '0'
                    ? ulaOperations.get(instructions.add.code)
                    : ulaOperations.get(instructions.sub.code);
                this.M6.select = M6Options.ula_flag;
                this.FR.write = true;
                this.M2.select = M2Options.ula;
                this[getRegister(instruction1.substring(6, 9))].write = true;
                break;
            case instructions.cmp.code:
                this.M3.select = M3Options[getRegister(instruction1.substring(6, 9))];
                this.M4.select = M4Options[getRegister(instruction1.substring(9, 12))];
                this.ula.op = ulaOperations.get(instructions.cmp.code);
                this.M6.select = M6Options.ula_flag;
                this.FR.write = true;
                break;
            case instructions.inchar.code:
                this.M2.select = M2Options.KEYBOARD;
                this[getRegister(instruction1.substring(6, 9))].write = true;
                break;
            case instructions.outchar.code:
                this.M3.select = M3Options[getRegister(instruction1.substring(6, 9))];
                this.M4.select = M4Options[getRegister(instruction1.substring(9, 12))];
                this.SCREEN.write = true;
                break;
            case instructions.jmp.code:
                if (conditionsCheck.get(instruction1.substring(6, 10))(this.ula.flags)) {
                    this.M1.select = M1Options.PC;
                    this.PC.write = true;
                    this.PC.increment = false;
                }
                break;
            case instructions.call.code:
                if (conditionsCheck.get(instruction1.substring(6, 10))(this.ula.flags)) {
                    this.M1.select = M1Options.SP;
                    this.M5.select = M5Options.PC;
                    this.memory.write = true;
                    this.SP.decrement = true;
                    this.PC.increment = false;
                    this.IR2.write = true;
                }
                this.IR1.reset = true;
                break;
            case instructions.rts.code:
                this.SP.increment = true;
                this.IR2.write = true;
                this.IR1.reset = true;
                break;
            case instructions.push.code:
                if (instruction1.substring(9, 10) === '0') {
                    this.M3.select = M3Options[getRegister(instruction1.substring(6, 9))];
                } else {
                    this.M3.select = M3Options.FR;
                }
                this.M5.select = M5Options.M3;
                this.M1.select = M1Options.SP;
                this.memory.write = true;
                this.SP.decrement = true;
                this.PC.increment = false;
                break;
            case instructions.pop.code:
                this.SP.increment = true;
                this.IR2.write = true;
                this.IR1.reset = true;
                this.PC.increment = false;
                break;
            case instructions.noop.code:
                break;
            case instructions.halt.code:
            case instructions.breakp.code:
                this.clock.stopClock();
                break;
        }

        switch (instruction2.substring(0, 6)) {
            case instructions.store.code:
                this.M1.select = M1Options.MAR;
                this.M3.select = M3Options[getRegister(instruction2.substring(6, 9))];
                this.M5.select = M5Options.M3;
                this.IR1.write = false;
                this.memory.write = true;
                this.IR2.reset = true;
                break;
            case instructions.load.code:
                this.M1.select = M1Options.MAR;
                this.M2.select = M2Options.memory;
                this.IR1.write = false;
                this[getRegister(instruction2.substring(6, 9))].write = true;
                this.IR2.reset = true;
                break;
            case instructions.call.code:
                this.M1.select = M1Options.PC;
                this.PC.write = true;
                this.PC.increment = false;
                this.IR1.reset = true;
                this.IR2.reset = true;
                break;
            case instructions.rts.code:
                this.M1.select = M1Options.SP;
                this.PC.write = true;
                this.PC.increment = false;
                this.IR2.reset = true;
                this.IR1.write = false;
                break;
            case instructions.pop.code:
                this.M1.select = M1Options.SP;
                if (instruction2.substring(9, 10) === '0') {
                    this.M2.select = M2Options.memory;
                    this[getRegister(instruction2.substring(6, 9))].write = true;
                } else {
                    this.M6.select = M6Options.memory;
                    this.FR.write = true;
                }
                this.PC.increment = false;
                this.IR1.write = false;
                this.IR2.reset = true;
                break;
        }

        this.simulateBus2();

        console.log('PC', this.PC.value, 'IR1', this.IR1.value, 'IR2', this.IR2.value, 'SP', this.SP.value, this.ula.flags, this.FR.value);
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
        this.SP.decrement = false;
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
        this.memory.write = false;
        this.SCREEN.write = false;
    }

    private simulateBus2() {
        this.PC.value = this.memory.value;
        this.MAR.value = this.memory.value;
        this.IR1.value = this.memory.value;
        this.IR2.value = this.IR1.value;
    }

    private simulateBus1() {
        this.ula.carry = this.FR.value.substring(15, 16);
        this.memory.address = this.M1.value;
        this.memory.value = this.M5.value;
    }
}
