import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hoc-observables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoc-observables.component.html',
  styleUrls: ['./hoc-observables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HocObservablesComponent {

}
