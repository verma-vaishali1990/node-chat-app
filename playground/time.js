const moment = require('moment');

// var date = new Date();
// console.log(date.getMonth());

var createdAt = 1234;
var date = moment(createdAt);
var someTime = moment().valueOf();
console.log(someTime);
//date.add(1,'year').subtract(9,'months');
console.log(date.format('MMM Do YYYY'));
console.log(date.format('hh:mm a'));
