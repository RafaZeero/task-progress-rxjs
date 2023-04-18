import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'task-progress',
    loadComponent: async () =>
      (await import('./task-progress/task-progress.component'))
        .TaskProgressComponent,
  },
  {
    path: 'operators',
    loadComponent: async () =>
      (await import('./operators/operators.component')).OperatorsComponent,
  },
  {
    path: 'dbl-click',
    loadComponent: async () =>
      (await import('./dbl-click/dbl-click.component')).DblClickComponent,
  },
  {
    path: 'hoc-maps',
    loadComponent: async () =>
      (await import('./hoc-maps/hoc-maps.component')).HocMapsComponent,
  },
  {
    path: 'hoc-observables',
    loadComponent: async () =>
      (await import('./hoc-observables/hoc-observables.component'))
        .HocObservablesComponent,
  },
  {
    path: 'common-mistakes',
    loadComponent: async () =>
      (await import('./common-mistakes/common-mistakes.component'))
        .CommonMistakesComponent,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
