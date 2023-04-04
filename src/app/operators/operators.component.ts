import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  buffer,
  bufferCount,
  bufferTime,
  combineLatest,
  debounce,
  debounceTime,
  delay,
  delayWhen,
  interval,
  map,
  merge,
  Observable,
  of,
  Subject,
  take,
  withLatestFrom,
  zip,
  zipWith,
} from 'rxjs';

@Component({
  selector: 'app-operators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorsComponent {
  public readonly foo$ = interval(500).pipe(take(4));
  public readonly bar$ = interval(300).pipe(take(5));

  public readonly hello$ = interval(600).pipe(
    take(5),
    zipWith(of('H', 'e', 'l', 'l', 'o')),
    map(([_, x]) => x)
  );

  public readonly numbers$ = interval(300).pipe(
    take(7),
    zipWith(of(0, 1, 0, 1, 0, 1, 0)),
    map(([_, x]) => x)
  );

  public operator$!: Observable<any>;
  public operatorName$!: Observable<any>;

  public ngOnInit() {
    // this.mergeOperator();
    // this.combineLatestOperator();
    // this.withLatestFromOperator();
    // this.zipOperator();
    // this.bufferOperators();
    // this.delayOperator();
    this.debounceOperator();
  }

  public zipOperator() {
    const hello$ = of('h', 'e', 'l', 'l', 'o');
    // const zipOp = zip(this.foo$, this.bar$, (x, y) => x + y);
    const zipOp = zip(this.hello$, this.bar$, (x, y) => x);

    this.operatorName$ = of('zip');

    zipOp.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }

  public withLatestFromOperator() {
    const mapWithLatestFrom = this.hello$.pipe(
      withLatestFrom(this.numbers$, (s, n) =>
        n === 1 ? s.toUpperCase() : s.toLowerCase()
      )
    );

    this.operatorName$ = of('withLatestFrom');

    mapWithLatestFrom.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }

  public mergeOperator() {
    const merged = merge(this.foo$, this.bar$); // Similar to an OR

    this.operatorName$ = of('merge');

    merged.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }

  public combineLatestOperator() {
    const latest = combineLatest([this.foo$, this.bar$]) // Similar to an AND
      .pipe(map(([x, y]) => x + y));

    this.operatorName$ = of('combineLatest');

    latest.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }

  public bufferOperators() {
    // const bufferOp = this.hello$.pipe(bufferCount(2));
    // const bufferOp = this.hello$.pipe(bufferTime(1000));
    const inner$ = interval(900).pipe(take(3));
    const bufferOp = this.hello$.pipe(buffer(inner$));

    this.operator$ = bufferOp;

    this.operatorName$ = of('bufferCount');

    bufferOp.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }

  public delayOperator() {
    // const delayOp = this.foo$.pipe(delay(1000));
    // const delayOp = this.foo$.pipe(delay(new Date().getSeconds() + 1000));
    const delayOp = this.foo$.pipe(
      delayWhen((x) => interval(x * x * 1000).pipe(take(1)))
    );

    this.operator$ = delayOp;
    this.operatorName$ = of('delay');

    delayOp.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }

  public debounceOperator() {
    /** Waits for x seconds of silence. Get last value if no silence */
    // const debounceOp = this.foo$.pipe(debounceTime(1000));
    const debounceOp = this.foo$.pipe(
      debounce(() => interval(1000).pipe(take(1)))
    );

    /**
     * debounceTime ====== delay
     * debounce ========== delayWhen
     */

    this.operator$ = debounceOp;

    this.operatorName$ = of('debounce');

    debounceOp.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }
}
