function Calculator() {
  this.methods = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };
  this.calculate = (a, op, b) => {
    return this.methods[op](a, b);
  };
}

const display = document.querySelector(".display");
// const displayArr = display.texContent.split("");
const displayContent = display.textContent;
const displayArr = displayContent.split("");
const ops = "+-*/"
const opIndex = displayArr.findIndex((char) => ops.includes(char));
const op = displayArr[opIndex];
const a = displayArr.slice(0, opIndex).join("");
const b = displayArr.slice(opIndex + 1).join("");
console.log(`a:${a}, op:${op}, b:${b}`);


