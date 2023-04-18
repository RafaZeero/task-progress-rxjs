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
  fromEvent,
  interval,
  map,
  merge,
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

  public click$ = fromEvent(document, 'click').pipe(
    map((v) => (v as MouseEvent).clientX)
  );
  public count$ = interval(1000);
  public four$ = timer(4000);

  public ngOnInit(): void {
    merge(this.click$, this.count$)
      .pipe(takeUntil(this.four$))
      .subscribe(this.subscriptionService.subFn('For each click'));
  }
}
