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
  public percentage = 0;
  public taskStarts = new Subject();
  public taskCompletions = new Subject();
  public showSpinner = (total: number, completed: number) =>
    new Observable<boolean>(() => {
      this.show = true;
      this.percentage = completed / total;
      console.log('total', total);
      console.log('completed', completed);
      return () => {
        this.show = false;
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
  public spinnerDeactivated = this.currentLoadCount.pipe(
    map((count) => count === 0)
  );
  /* When does the loader appears? -> When does the async tasks goes from 0 to 1 */
  public spinnerActivated = this.currentLoadCount.pipe(
    pairwise(),
    map(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
  );

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  public loadStats = this.currentLoadCount.pipe(
    scan(
      (loadStats, loadingUpdate) => {
        const loadsWentDown: boolean =
          loadingUpdate < loadStats.previousLoading;
        const currentCompleted = loadsWentDown
          ? loadStats.completed + 1
          : loadStats.completed;

        return {
          total: currentCompleted + loadingUpdate,
          completed: currentCompleted,
          previousLoading: loadingUpdate,
        };
      },
      { total: 0, completed: 0, previousLoading: 0 }
    )
  );

  public spinnerWithStats = this.loadStats.pipe(
    switchMap((stats) => this.showSpinner(stats.total, stats.completed))
  );

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  /**
   * Spinner active: switch to wait 2s before showing it
   * cancel if inactive again in the meantime
   */

  public shouldShowSpinner = this.spinnerWithStats.pipe(
    switchMap(() => timer(2000).pipe(takeUntil(this.spinnerDeactivated))),
    tap(() => console.log('aaaaaaaaaaa'))
  );

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  /**
   * When spinners needs to show
   * -> show the spinner until it's time to hide it
   */

  public spinner = this.spinnerActivated.pipe(
    switchMap(() =>
      this.showSpinner(0, 0).pipe(takeUntil(this.spinnerDeactivated))
    )
  );

  public ngOnInit() {}

  public newTaskStarted(val: any) {
    this.taskStarts.next(val);
  }

  public existingTaskCompleted(val: any) {
    this.taskCompletions.next(val);
  }
  public slowObservable$ = timer(3000);
  public verySlowObservable$ = timer(6000);
  public tasksNum = 0;

  public doWork() {
    this.shouldShowSpinner.subscribe();
    this.newTaskStarted(0);
    // const sub = this.showSpinner().subscribe();
    this.slowObservable$
      .pipe(finalize(() => this.existingTaskCompleted(0)))
      .subscribe
      //
      // () => sub.unsubscribe()
      ();
  }

  public doLongWork() {
    this.shouldShowSpinner.subscribe();
    this.newTaskStarted(0);
    // const sub = this.showSpinner.subscribe();
    this.verySlowObservable$
      .pipe(finalize(() => this.existingTaskCompleted(0)))
      .subscribe
      //
      // () => sub.unsubscribe()
      ();
  }
}
