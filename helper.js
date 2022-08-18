const readline = require('readline-sync');

exports.log = message => {
  console.log(message);
};

exports.emptySpace = () => {
  console.log(" ");
};

exports.clear = () => {
  console.clear();
};

exports.getUserInput = message => {
  return readline.question(message).toLowerCase();
};

exports.confirm = message => {
  return readline.keyInYN(message);
};

exports.randomMumber = ceil => {
  return Math.floor(Math.random() * ceil);
};

