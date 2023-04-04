import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {
  combineLatestWith,
  concatMap,
  forkJoin,
  interval,
  map,
  mergeMap,
  Observable,
  of,
  pairwise,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-hoc-maps',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './hoc-maps.component.html',
  styleUrls: ['./hoc-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HocMapsComponent {
  public concat$: any;
  public merge$!: Observable<{
    names: string[];
    evolved: { [x: string]: boolean }[];
    hasSkills: { [x: string]: boolean }[];
  }>;

  public merge2$!: Observable<number>;

  public requestOne$ = interval(1000).pipe(take(2));
  public requestTwo$ = interval(2000).pipe(take(3));

  public dataOne$ = of({
    name: 'Daniel',
    class: 'bard',
    skills: ['Crying'],
    age: 0.5,
    evolved: true,
  });

  public dataTwo$ = of({
    name: 'Rafael',
    class: 'archer',
    skills: ['Aimed bot'],
    age: 29,
    evolved: false,
  });

  public ngOnInit() {
    // this.mergeMapOperator();
    this.mergeMapOperator2();
  }

  public mergeMapOperator() {
    const mergeMapOp = this.requestOne$.pipe(
      mergeMap(() => this.requestTwo$),
      // Get value from requestOne (x) and multiply by requestTwo (y)
      map((x, y) => x * y)
    );

    this.merge2$ = mergeMapOp;

    mergeMapOp.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }

  public mergeMapOperator2() {
    const mergeMapOp = timer(2000).pipe(
      mergeMap(() => this.dataOne$),
      combineLatestWith(this.dataTwo$),
      map(([x, y]) => ({
        names: [x.name, y.name],
        evolved: [{ [x.name]: x.evolved, [y.name]: y.evolved }],
        hasSkills: [
          { [x.name]: x.skills.length > 0, [y.name]: y.skills.length > 0 },
        ],
      }))
    );

    this.merge$ = mergeMapOp;

    mergeMapOp.subscribe({
      next: (x) => console.log(x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }
}
