function Calculator() {
  this.methods = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };
  this.calculate = (operation) => {
    let splited = operation.split(" ");
    let op = splited[1];
    let a = +splited[0];
    let b = +splited[2];
    return this.methods[op](a, b);
  };
}

const powerCalc = new Calculator;
const last = document.querySelector(".last");
// const lastArr = last.texContent.split("");
const lastContent = last.textContent;
const operate = document.querySelector(".equal");
const curr = document.querySelector(".curr");
operate.addEventListener("click", () => {
  return curr.textContent = powerCalc.calculate(lastContent);
})
