import { Component } from '@angular/core';
import {
  distinctUntilChanged,
  map,
  merge,
  Observable,
  pairwise,
  scan,
  shareReplay,
  startWith,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'task-progress-rxjs';

  /**
   * Start counting from 0
   * When an Async task starts, count +1
   * When an Async task completes, coun -1
   */

  public startingValue = 0;
  public taskStarts = new Observable();
  public taskCompletions = new Observable();
  public showSpinner = new Observable();

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
}
