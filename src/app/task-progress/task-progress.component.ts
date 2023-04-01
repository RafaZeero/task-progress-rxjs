import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf, PercentPipe } from '@angular/common';
import {
  Subject,
  Observable,
  map,
  merge,
  startWith,
  scan,
  distinctUntilChanged,
  shareReplay,
  pairwise,
  switchMap,
  fromEvent,
  tap,
  filter,
  exhaustMap,
  takeUntil,
  timer,
  takeWhile,
  skip,
  take,
  combineLatest,
  interval,
  finalize,
} from 'rxjs';

@Component({
  selector: 'app-task-progress',
  standalone: true,
  imports: [NgIf, AsyncPipe, PercentPipe],
  templateUrl: './task-progress.component.html',
  styleUrls: ['./task-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskProgressComponent {
  /**
   * Start counting from 0
   * When an Async task starts, count +1
   * When an Async task completes, coun -1
   */

  public startingValue = 0;
  public percentage = 0;
  public taskStarts = new Subject<void>();
  public taskCompletions = new Subject<void>();
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

  public reset$ = fromEvent(document, 'keypress').pipe(
    map(value => 'reset'),
  )

  public loadStats = merge(this.currentLoadCount, this.reset$).pipe(
    scan(
      (loadStats: any, loadingUpdate: any) => {
        if(loadingUpdate === 'reset'){
          return  { total: 0, completed: 0, previousLoading: 0 }
        }
        const loadsWentDown: boolean =
          loadingUpdate < loadStats.previousLoading;
        const currentCompleted: number = loadsWentDown
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
   * Whenever starts combo keys
   *    -> Keep listening for the rest of the combo keys
   *          -> Until the timer has run out
   *          -> While the combo is being followed correctly
   *          -> And until we've got (comboLenght - 1) keys back
   */

  public anyKeyPresses = fromEvent(document, 'keyup').pipe(
    map((event: Event) => (event as KeyboardEvent).key),
    tap(console.log)
  );

  public keyPressed(key: KeyboardEvent['key']) {
    return this.anyKeyPresses.pipe(filter((pressedKey) => pressedKey === key));
  }

  public keyCombo(keyCombo: KeyboardEvent['key'][]) {
    const comboInitiator = keyCombo[0];
    return this.keyPressed(comboInitiator).pipe(
      // switchMap(() => {
      exhaustMap(() => {
        // Now in combo mode!!
        return this.anyKeyPresses.pipe(
          takeUntil(timer(3000)),
          takeWhile((keyPressed, index) => keyCombo[index + 1] === keyPressed),
          skip(keyCombo.length - 2),
          take(1)
        );
      })
    );
  }

  public comboTriggered = this.keyCombo(['a', 's', 'a', 'f']);

  public hideSpinnerCombo = this.keyCombo(['q', 'w', 'e', 'r', 't', 'y']);

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  /**
   * Spinner active: switch to wait 2s before showing it
   * cancel if inactive again in the meantime
   */
  public flashThreshold = timer(2000);

  // public shouldShowSpinner = this.spinnerWithStats.pipe(
  //   switchMap(() =>
  //     this.flashThreshold.pipe(takeUntil(this.spinnerDeactivated))
  //   )
  // );

  public shouldShowSpinner = this.spinnerActivated.pipe(
    switchMap(() =>
      this.flashThreshold.pipe(takeUntil(this.spinnerDeactivated))
    ),
    switchMap(() =>
      this.spinnerWithStats.pipe(takeUntil(this.shouldHideSpinner))
    ),
    takeUntil(this.hideSpinnerCombo)
  );

  public shouldHideSpinner = combineLatest([
    this.spinnerDeactivated,
    this.flashThreshold,
  ]);

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

  constructor() {}

  public ngOnInit() {
    // this.newTaskStarted();
    // interval(1000)
    //   .pipe(takeUntil(this.comboTriggered))
    //   .subscribe({
    //     next: (x) => console.log('next:', x),
    //     complete: () => console.log('COMPLETED!!'),
    //   });
    this.spinnerWithStats.subscribe();
    // this.shouldShowSpinner.subscribe();
    // interval(1000)
    //   .pipe(take(2), this.showLoadingStatus())
    //   .subscribe({
    //     next: (x) => console.log('NEXT: ', x),
    //     complete: () => console.log('COMPLETED'),
    //   });
  }

  public newTaskStarted() {
    this.taskStarts.next();
  }

  public existingTaskCompleted() {
    this.taskCompletions.next();
  }
  public slowObservable$ = timer(3000).pipe(this.showLoadingStatus());
  public verySlowObservable$ = timer(6000).pipe(this.showLoadingStatus());
  public tasksNum = 0;

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  public showLoadingStatus() {
    return (source: Observable<any>) => {
      return new Observable((subscriber) => {
        // I'VE BEEN SUBSCRIBED TO
        this.newTaskStarted();
        console.log('task start...');

        const sourceSub = source.subscribe(subscriber);
        return () => {
          sourceSub.unsubscribe();
          this.existingTaskCompleted();
          console.log('task complete...');
        };
      });
    };
  }

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

  public doWork() {
    this.slowObservable$.subscribe();
  }

  public doLongWork() {
    this.verySlowObservable$.subscribe();
  }
}
