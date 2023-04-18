import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SubscribeService {
  public subFn = (message: string = '') => ({
    next: (x: any) => console.log(message, x),
    error: (err: any) => console.log('error: ' + err),
    complete: () => console.log('done'),
  });

  constructor() {}
}
