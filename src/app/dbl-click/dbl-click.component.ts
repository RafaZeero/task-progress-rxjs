import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  bufferWhen,
  combineLatest,
  debounceTime,
  delay,
  filter,
  first,
  firstValueFrom,
  fromEvent,
  interval,
  last,
  lastValueFrom,
  map,
  scan,
  takeUntil,
  tap,
  throttle,
} from 'rxjs';

@Component({
  selector: 'app-dbl-click',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dbl-click.component.html',
  styleUrls: ['./dbl-click.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DblClickComponent {
  @ViewChild('button') button!: ElementRef;

  label!: string;
  clicks = 0;

  ngAfterViewInit() {
    const button = this.button.nativeElement;

    const clicks$ = fromEvent(button, 'click').pipe(
      scan((count) => count + 1, 0)
    );

    clicks$.subscribe((count) => {
      this.clicks = count as number;
      console.log('Total count: ', count);
    });
  }

  initClickStream() {
    const clickStream = fromEvent(this.button.nativeElement, 'click');

    clickStream.pipe(scan((count: number) => count + 1, 0));

    const doubleClickStream = clickStream.pipe(
      bufferWhen(() => clickStream.pipe(debounceTime(250))),
      map((arr) => arr.length),
      filter((len) => len === 2)
    );

    doubleClickStream.subscribe(() => {
      this.label = 'double click';
    });

    doubleClickStream.pipe(throttle(() => interval(1000))).subscribe(() => {
      this.label = '-empty';
    });
  }
}
