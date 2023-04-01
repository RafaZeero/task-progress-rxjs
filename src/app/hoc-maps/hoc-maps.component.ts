import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hoc-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoc-maps.component.html',
  styleUrls: ['./hoc-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HocMapsComponent {

}
