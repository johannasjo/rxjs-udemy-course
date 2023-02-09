import './style.css';

import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const interval$ = new Observable<number>((subscriber) => {
  let counter = 1;
  const intervalId = setInterval(() => {
    console.log('emitted', counter);
    subscriber.next(counter++);
  }, 2000);

  return () => {
    console.log('clear interval');
    clearInterval(intervalId);
  };
});

let subscription = interval$.subscribe({ next: (value) => console.log(value) });

setTimeout(() => {
  console.log('unsubscribe');
  subscription.unsubscribe();
}, 10000);

// example of cold observable
const nameReq$ = ajax<any>('https://random-data-api.com/api/name/random_name');
nameReq$.subscribe((randomName) => {
  console.log(randomName.response?.first_name);
});
