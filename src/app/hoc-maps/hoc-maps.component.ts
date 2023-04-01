import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, map, mergeMap, Observable, take, tap } from 'rxjs';

@Component({
  selector: 'app-hoc-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoc-maps.component.html',
  styleUrls: ['./hoc-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HocMapsComponent {
  public concat$: any;
  public merge$!: Observable<any>;

  public requestOne$ = interval(1000).pipe(take(2));
  public requestTwo$ = interval(2000).pipe(take(3));

  public ngOnInit() {
    this.mergeMapOperator();
  }

  public mergeMapOperator() {
    const mergeMapOp = this.requestOne$.pipe(
      mergeMap(() => this.requestTwo$),
      // Get value from requestOne (x) and multiply by requestTwo (y)
      map((x, y) => x * y)
    );

    this.merge$ = mergeMapOp;

    mergeMapOp.subscribe({
      next: (x) => console.log('next ' + x),
      error: (err) => console.log('error ' + err),
      complete: () => console.log('done'),
    });
  }
}
