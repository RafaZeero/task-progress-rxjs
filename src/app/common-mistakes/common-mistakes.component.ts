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
  interval,
  merge,
  switchMap,
  takeUntil,
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

  public click$ = new Observable((observer) => {
    const listener = (e: MouseEvent) => observer.next(e.clientX);
    document.addEventListener('click', listener);

    return () => document.removeEventListener('click', listener);
  });

  public count$ = interval(1000);

  public ngOnInit(): void {
    const sub = merge(this.click$, this.count$).subscribe(
      this.subscriptionService.subFn('For each click')
    );

    setTimeout(() => {
      sub.unsubscribe();
    }, 4000);
  }
}
