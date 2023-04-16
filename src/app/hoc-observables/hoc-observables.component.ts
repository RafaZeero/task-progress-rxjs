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
  windowToggle,
  groupBy,
  concatMap,
  delay,
  merge,
  filter,
  skip,
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
    // this.result$.subscribe(this.subFn());
    // this.num2$.subscribe(this.subFn());
    this.all$.subscribe(this.subFn());
  }

  public subFn = () => ({
    next: (x: any) => console.log(x),
    error: (err: any) => console.log('error: ' + err),
    complete: () => console.log('done'),
  });

  // * Higher Order Observables part 1
  public numObservable = interval(1000).pipe(take(4));
  public higherOrderObservable = this.numObservable.pipe(map((x) => of(x)));
  // higherOrderObservable.subscribe(subFn);

  public click$ = fromEvent(document, 'click');
  public clock$ = interval(1000);
  public mouseUp$ = fromEvent(document, 'mouseup');
  public mouseDown$ = fromEvent(document, 'mousedown');

  // * The same as the code below
  // public result$ = this.clock$.pipe(
  //   window(this.click$),
  //   map((obs) => obs.pipe(count())),
  //   switchAll()
  // );
  public result$ = this.clock$.pipe(
    windowToggle(this.mouseDown$, () => this.mouseUp$),
    /* Count only for how long will hold mouse down */
    switchMap((obs) => obs.pipe(count()))
    /* Show Count for every number when holding mouse down */
    // switchAll()
  );

  public num2$ = interval(500).pipe(
    take(5),
    /* Split into 2 observables, even & odds */
    groupBy((x) => x % 2),
    /* Count how many values they have in each observable */
    mergeMap((inner$) => inner$.pipe(count()))
    /* Get final value for both observables concurrently*/
    // map((inner$) => inner$.pipe(count()))
    // mergeAll()
  );

  public langs$ = of(
    { code: 'en-us', value: '-TEST-' },
    { code: 'en-us', value: 'hello' },
    { code: 'es', value: '-TEST-' },
    { code: 'en-us', value: 'amazing' },
    { code: 'pt-br', value: '-TEST-' },
    { code: 'pt-br', value: 'olá' },
    { code: 'es', value: 'hola' },
    { code: 'es', value: 'mundo' },
    { code: 'en-us', value: 'world' },
    { code: 'pt-br', value: 'mundo' },
    { code: 'es', value: 'asombroso' },
    { code: 'pt-br', value: 'maravilhoso' }
  ).pipe(
    concatMap((x) => of(x)),
    delay(500)
  );

  // * DO NOT MAKE THIS
  public enUS = this.langs$.pipe(
    filter((obj) => obj.code === 'en-us'),
    skip(1),
    map((obj) => obj.value)
  );

  public es = this.langs$.pipe(
    filter((obj) => obj.code === 'en-us'),
    skip(1),
    map((obj) => obj.value)
  );

  public ptBR = this.langs$.pipe(
    filter((obj) => obj.code === 'en-us'),
    skip(1),
    map((obj) => obj.value)
  );
  public all2$ = merge(this.enUS, this.es, this.ptBR);
  // * ********************* *

  // * DO THIS INSTEAD!!

  public all$ = this.langs$.pipe(
    groupBy((obj) => obj.code),
    mergeMap((inner$) =>
      inner$.pipe(
        skip(1),
        map((obj) => obj.value)
      )
    )
  );

  /**
   * switchMap() = map() + switchAll()
   * mergeMap() = map() + mergeAll()
   * concatMap() = map() + concatAll()
   */
}
