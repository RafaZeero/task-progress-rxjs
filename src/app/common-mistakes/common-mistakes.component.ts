import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Observable,
  Subject,
  from,
  fromEvent,
  interval,
  map,
  merge,
  scan,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { SubscribeService } from '../services';

@Component({
  selector: 'app-common-mistakes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-mistakes.component.html',
  styleUrls: ['./common-mistakes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonMistakesComponent implements OnInit {
  public subscriptionService = inject(SubscribeService);

  // public click = new Subject<MouseEvent>();

  public ngOnInit(): void {
    // merge(this.click$, this.count$)
    //   .pipe(takeUntil(this.four$))
    //   .subscribe(this.subscriptionService.subFn('For each click'));
    // this.count$.subscribe(this.subscriptionService.subFn());
    this.tickWhenClick$.subscribe(this.subscriptionService.subFn());
  }

  public xCoordFromClick$ = fromEvent(document, 'click').pipe(
    map((v) => (v as MouseEvent).clientX)
  );

  public click$ = fromEvent(document, 'click');
  // public count$ = interval(1000);
  // public four$ = timer(4000);

  // 1. Identify source of data
  // 2. Convert to Observables
  // 3. Compose

  // public res$ = from(
  //   fetch('https://jsonplaceholder.typicode.com/users/1').then((res) =>
  //     res.json()
  //   )
  // );

  // public count$ = merge(this.click$, this.res$).pipe(
  //   map(() => 1),
  //   scan((acc, x) => acc + x, 0)
  // );

  public tickWhenClick$ = this.click$.pipe(switchMap(() => interval(500)));
}
