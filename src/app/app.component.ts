import { Component, OnInit } from '@angular/core';
import {
  distinctUntilChanged,
  finalize,
  map,
  merge,
  Observable,
  pairwise,
  scan,
  shareReplay,
  startWith,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'task-progress-rxjs';

  /**
   * Start counting from 0
   * When an Async task starts, count +1
   * When an Async task completes, coun -1
   */

  public startingValue = 0;
  public taskStarts = new Subject();
  public taskCompletions = new Subject();
  public showSpinner = new Observable<boolean>(() => {
    this.show = true;
    console.log('show true');
    return () => {
      this.show = false;
      console.log('show false');
    };
  });
  public show = false;

  public loadUp = this.taskStarts.pipe(map(() => 1));
  public loadDown = this.taskCompletions.pipe(map(() => -1));

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //
  // Events:

  public loadVariation = merge(this.loadUp, this.loadDown);

  /* Single source of truth */
  public currentLoadCount = this.loadVariation.pipe(
    startWith(this.startingValue) /* First emits value 0 */,
    scan(
      /* What type of state is scan holding? */
      (totalCurrentLoads, changeInLoads) =>
        totalCurrentLoads + changeInLoads < 0
          ? 0 /* To avoid any negative value */
          : totalCurrentLoads + changeInLoads /* Expected values */
    ),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Is scan transient? Emits different values for different subscribers
   * Is scan single source of truth? Emits same values for different subscribers
   */

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  /* When does the loader hides? -> When does the async tasks goes to 0 */
  public shouldHideSpinner = this.currentLoadCount.pipe(
    map((count) => count === 0)
  );
  /* When does the loader appears? -> When does the async tasks goes from 0 to 1 */
  public shouldShowSpinner = this.currentLoadCount.pipe(
    pairwise(),
    map(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
  );

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  /**
   * When spinners needs to show
   * -> show the spinner until it's time to hide it
   */

  public spinner = this.shouldShowSpinner.pipe(
    switchMap(() => this.showSpinner.pipe(takeUntil(this.shouldHideSpinner)))
  );

  public ngOnInit() {}

  public newTaskStarted(val: any) {
    this.taskStarts.next(val);
  }

  public existingTaskCompleted(val: any) {
    this.taskCompletions.next(val);
  }

  public add() {
    this.newTaskStarted(0);
    // this.loadVariation.subscribe((x) => console.log('loadVariation', x));
    // this.loadUp.subscribe((x) => console.log('loadUp', x));
    // this.loadDown.subscribe((x) => console.log('loadDown', x));
    this.currentLoadCount.subscribe((x) => console.log('currentLoadCount', x));
  }
  public decrease() {
    this.existingTaskCompleted(0);
  }

  public slowObservable$ = timer(3000);
  public verySlowObservable$ = timer(6000);
  public tasksNum = 0;

  public doWork() {
    this.newTaskStarted(0);
    const sub = this.showSpinner.subscribe();
    this.slowObservable$
      .pipe(finalize(() => this.existingTaskCompleted(0)))
      .subscribe(() => sub.unsubscribe());
  }

  public doLongWork() {
    this.newTaskStarted(0);
    const sub = this.showSpinner.subscribe();
    this.verySlowObservable$
      .pipe(finalize(() => this.existingTaskCompleted(0)))
      .subscribe(() => sub.unsubscribe());
  }
}
