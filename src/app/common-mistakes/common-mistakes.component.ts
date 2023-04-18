import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-common-mistakes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-mistakes.component.html',
  styleUrls: ['./common-mistakes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonMistakesComponent {

}
