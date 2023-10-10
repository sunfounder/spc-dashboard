function isNum(data) {
  return !isNaN(Number(data, 10));
}

function round(number, index) {
  if (isNum(number)) {
    let a = 10 ** index;
    return parseInt(number * a) / a;
  }
  return number;
}

function firstUpperCase(string) {
  string =  string[0].toUpperCase() + string.slice(1);
  return string;
}

export { isNum, round, firstUpperCase };