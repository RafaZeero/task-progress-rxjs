import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'task-progress-rxjs';

  public taskStarts = new Observable();
  public taskCompletions = new Observable();
  public showSpinner = new Observable();
}
