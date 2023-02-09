import './style.css';

import { from, fromEvent, Observable, of } from 'rxjs';
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

// example of hot observable
const button = document.querySelector('#clickBtn');
// const userClick$ = new Observable<any>((clickEvent) => {
//   button.addEventListener('click', (event) => {
//     clickEvent.next(event);
//   });
// });

// userClick$.subscribe((event) =>
//   console.log('first sub', event.type, event.x, event.y)
// );

// setTimeout(() => {
//   console.log('second sub start');
//   userClick$.subscribe((event) =>
//     console.log('second sub', event.type, event.x, event.y)
//   );
// }, 10000);

// of creation function

of('johanna', 'carl', 'bella').subscribe((value) => {
  console.log(value);
});

// from creation function

from(['Alice', 'Ben', 'Charlie']).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('completed'),
});

// convert promise to observable
const somePromise = new Promise((resolve, reject) => {
  // resolve('Resolved');
  reject('Rejected');
});
const observableFromPromise$ = from(somePromise);
observableFromPromise$.subscribe({
  next: (value) => console.log('promise to observable message: ', value),
  complete: () => console.log('promise to observable completed'),
  error: (value) =>
    console.log('promise to observable rejected message: ', value),
});

// fromEvent

fromEvent(button, 'click').subscribe((value) => {
  console.log(value.type);
});

// fromEvent but making it from scratch

const triggerClick$ = new Observable<any>((clicks) => {
  const clickHandlerFunction = (event) => {
    clicks.next(event);
  };
  button.addEventListener('click', clickHandlerFunction);

  return () => {
    button.removeEventListener('click', clickHandlerFunction);
  };
});

const btnSubscription = triggerClick$.subscribe((event) => console.log(event));

setTimeout(() => {
  console.log('unsubscribe from the button sub');
  btnSubscription.unsubscribe();
}, 10000);
