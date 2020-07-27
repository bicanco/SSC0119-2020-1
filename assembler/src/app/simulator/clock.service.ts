import { interval, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class ClockService {

    private readonly clockMiliseconds = 200;

    private clock$: Subject<number> = new Subject<number>();
    private stopClockSubject: Subject<boolean> = new Subject<boolean>();

    get clock() {
        return this.clock$.asObservable();
    }

    startClock() {
        interval(this.clockMiliseconds).pipe(
            untilDestroyed(this),
            takeUntil(this.stopClockSubject),
            tap(value => this.clock$.next(value)),
        ).subscribe();
    }

    stopClock() {
        this.stopClockSubject.next(true);
    }

    tick() {
        this.clock$.next(1);
    }
}
