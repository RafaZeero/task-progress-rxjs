import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  interval,
  take,
  map,
  of,
  fromEvent,
  switchAll,
  mergeAll,
  concatAll,
  mergeMap,
  window,
  count,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-hoc-observables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoc-observables.component.html',
  styleUrls: ['./hoc-observables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HocObservablesComponent implements OnInit {
  public ngOnInit(): void {
    // this.clock$.subscribe(this.subFn());
    this.result$.subscribe(this.subFn());
  }

  public subFn = () => ({
    next: (x: any) => console.log('next ' + x),
    error: (err: any) => console.log('error ' + err),
    complete: () => console.log('done'),
  });

  // * Higher Order Observables part 1
  public numObservable = interval(1000).pipe(take(4));
  public higherOrderObservable = this.numObservable.pipe(map((x) => of(x)));
  // higherOrderObservable.subscribe(subFn);

  public click$ = fromEvent(document, 'click');
  public clock$ = interval(1000);

  // * The same as the code below
  // public result$ = this.clock$.pipe(
  //   window(this.click$),
  //   map((obs) => obs.pipe(count())),
  //   switchAll()
  // );
  public result$ = this.clock$.pipe(
    window(this.click$),
    switchMap((obs) => obs.pipe(count()))
  );

  /**
   * switchMap() = map() + switchAll()
   * mergeMap() = map() + mergeAll()
   * concatMap() = map() + concatAll()
   */
}
