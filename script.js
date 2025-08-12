'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [
    8905.27, 9563.72, 17490.09, -71.97, 2599.35, 11199.2, 2571.15, 25326.72,
  ],
  interestRate: 1.3,
  pin: 3333,

  movementsDates: [
    '2023-08-24T16:30:57.086356Z',
    '2022-11-24T16:30:57.086356Z',
    '2022-06-27T16:30:57.086356Z',
    '2021-11-22T16:30:57.086356Z',
    '2020-11-07T16:30:57.086356Z',
    '2024-10-06T16:30:57.086356Z',
    '2025-07-31T16:30:57.086356Z',
    '2023-07-22T16:30:57.086356Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [
    6662.11, 19482.01, 9497.36, 726.94, 2123.76, 20383.68, 20429.83, 23956.49,
  ],
  interestRate: 1.4,
  pin: 4444,

  movementsDates: [
    '2021-05-24T16:30:57.086495Z',
    '2021-11-03T16:30:57.086495Z',
    '2022-07-13T16:30:57.086495Z',
    '2020-08-20T16:30:57.086495Z',
    '2024-03-14T16:30:57.086495Z',
    '2025-02-21T16:30:57.086495Z',
    '2023-04-21T16:30:57.086495Z',
    '2020-10-29T16:30:57.086495Z',
  ],
  currency: 'CAD',
  locale: 'en-CA',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let currentAcc, timeout;

let passedDays = function (date1, date2 = new Date()) {
  return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
};
let formatDate = function (date, locale) {
  let diff = passedDays(date);
  switch (diff) {
    case 0:
      return 'TODAY';
    case 1:
      return 'Yesterday';
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return `${diff} days ago`;
    case 7:
      return 'One week ago';
    default: {
      return new Intl.DateTimeFormat(locale).format(date);
    }
  }
};

let startLogoutTimer = function () {
  let time = 300;
  let min;
  let seconds;
  let startFunc = function () {
    min = String(Math.trunc(time / 60)).padStart(2, 0);
    seconds = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${seconds}`;
    if (time === 0) {
      clearInterval(tiemout);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  startFunc();
  let tiemout = setInterval(startFunc, 1000);
  return tiemout;
};

let display = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  let combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    date: acc.movementsDates[i],
  }));
  if (sort) {
    combinedMovsDates.sort((a, b) => a.movement - b.movement);
  }
  combinedMovsDates.forEach(function (obj, index) {
    let { movement: objMovement, date: objDate } = obj;
    let type = objMovement > 0 ? `deposit` : `withdrawal`;
    let displayDate = new Date(objDate);
    let date = formatDate(displayDate, currentAcc.locale);
    let formattedMov = new Intl.NumberFormat(currentAcc.locale, {
      style: 'currency',
      currency: `${currentAcc.currency}`,
    }).format(objMovement);
    let insStr = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${date}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', insStr);
  });
};

let ComputeUser = function (accs) {
  accs.forEach(function (acc) {
    let Nstr = acc.owner.split(' ');
    acc.userName = Nstr.map(function (el, _) {
      return el[0].toLowerCase();
    });
    acc.userName = acc.userName.join('');
  });
};

ComputeUser(accounts);
// console.log(account2, account3, account4, account1);
let calcBalance = function (account) {
  let balance = account.movements.reduce(function (acc, el) {
    return acc + el;
  }, 0);
  account.balance = balance;
  labelBalance.textContent = `${balance.toFixed(2)} ${account.currency}`;
};

function calcSummary(acc) {
  const incomeVal = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);

  const outVal = acc.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);

  const interestVal = (incomeVal * acc.interestRate) / 100;

  const nf = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  });

  labelSumIn.textContent = nf.format(incomeVal);
  labelSumOut.textContent = nf.format(Math.abs(outVal));
  labelSumInterest.textContent = nf.format(interestVal);
}

let updateDates = function () {
  let date = new Date();
  let year = date.getFullYear();
  let month = `${date.getMonth() + 1}`.padStart(2, 0);
  let day = `${date.getDate()}`.padStart(2, 0);
  let hours = `${date.getHours()}`.padStart(2, 0);
  let mins = `${date.getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}, ${hours}:${mins} `;
};
updateDates();

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  if (timeout) clearInterval(timeout);
  timeout = startLogoutTimer();
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAcc?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    display(currentAcc);
    calcBalance(currentAcc);
    calcSummary(currentAcc);
  } else {
  }
});

let updateUI = function (Acc) {
  display(Acc);
  calcBalance(Acc);
  calcSummary(Acc);
};

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = +inputTransferAmount.value;
  let recieverID = inputTransferTo.value;
  let recieverAcc = accounts.find(acc => acc.userName === recieverID);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    amount <= currentAcc.balance &&
    recieverAcc &&
    recieverAcc?.userName !== currentAcc.userName
  ) {
    currentAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAcc);
    clearInterval(timeout);
    startLogoutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.userName &&
    +inputClosePin.value === currentAcc.pin
  ) {
    let index = accounts.findIndex(acc => acc.userName === currentAcc.userName);
    console.log(index);
    accounts.splice(index, 1);
    // console.log(accounts);
  }
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
  containerApp.style.opacity = 0;
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let LoanAmount = Math.floor(+inputLoanAmount.value);
  if (
    currentAcc.movements.some(el => el > 0.1 * LoanAmount) &&
    LoanAmount > 0
  ) {
    currentAcc.movements.push(LoanAmount);
    currentAcc.movementsDates.push(new Date().toISOString());
    let delay = setTimeout(updateUI, 2000, currentAcc);
    clearInterval(timeout);
    startLogoutTimer();
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  display(currentAcc, !sorted);
  sorted = !sorted;
});

// math random number
let rand = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
// test data

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = [1, 2, 34, 3];

// console.log(arr.slice(1));
// let arr2 = arr.slice();
// arr2 = [...arr];
// arr2[0] = 0;
// console.log(arr, arr2);
// console.log(-arr.length + 1);
// console.log(arr.splice(1, 2));
// console.log(arr);

// let b = [10, 20, 30, 40, 50];
// console.log(b.splice(1, 3));
// console.log(arr.reverse());
// console.log(arr.concat(b));
// console.log(arr.at(-1));
// let arrtest = [1, 2, -6, 4, -3];
// arrtest.forEach(function (el, index, arr) {
//   if (el < 0) console.log(`${el} of ind ${index} is negative`);
//   else {
//     console.log(`${el} is positive`);
//   }
//   console.log(`of array ${arr}`);
// });

// let m = new Map([
//   [3, 'c'],
//   [4, 'd'],
// ]);
// m.set(1, 'a');
// m.set(2, 'b');
// // m.forEach();

// let s = new Set([1, 2, 4, 6, 7, 8]);
// s.forEach(function (el, el2, set) {
//   console.log(`num is ${el} and ${el2} of ${[...set]} `);
// });
// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];
// let avghuskywieght = function (arr) {
//   return arr.map(obj => obj.averageWeight).reduce(avg => avg / arr.length);
// };
// console.log(avghuskywieght(breeds));
// console.log(
//   breeds.find(
//     obj =>
//       obj.activities.includes('running') && obj.activities.includes('fetch')
//   ).breed
// );
// console.log(breeds.flatMap(obj => obj.activities));
// console.log([...new Set(breeds.flatMap(obj => obj.activities))]);
// let filtered = breeds
//   .filter(obj => obj.activities.includes('swimming'))
//   .map(obj => obj.activities)
//   .flat();
// console.log(filtered);
// console.log([...new Set(filtered)].filter(el => el !== 'swimming'));
// console.log(breeds.map(obj => obj.averageWeight).every(el => el > 10));
// console.log(breeds.map(obj => obj.activities).some(arr => arr.length >= 3));
// let fetches = breeds
//   .filter(obj => obj.activities.includes('fetch'))
//   .map(obj => obj.averageWeight)
//   .reduce((max, el) => (max > el ? max : el), 0);
// console.log(fetches);

// console.log(
//   Object.groupBy(breeds, obj =>
//     obj.averageWeight > 20 ? 'old-enough' : 'under-age'
//   )
// );
let num = 30;
console.log(0.1 + 0.2 === 0.3);
console.log(Number.parseInt('30', 2));
console.log(num.toString(2));
console.log(Number.isNaN('2'));
console.log((2.6).toFixed(8));
console.log(Number.parseInt('230_000'));
console.log(parseInt('230_000'));
console.log(20n == 20);
console.log(90078 * 10 ** 3099);
let date = new Date();
console.log(date);
let Ndate = new Date();
console.log(Ndate);
let options = {
  hour: 'numeric',
  day: 'numeric',
  year: 'numeric',
  month: '2-digit',
  minute: 'numeric',
};
let locale = navigator.language;
