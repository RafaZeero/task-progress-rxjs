import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dbl-click',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dbl-click.component.html',
  styleUrls: ['./dbl-click.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DblClickComponent {

}
