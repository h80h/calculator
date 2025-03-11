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
const operands = document.querySelector(".operands");
const operate = document.querySelector("#operate");
const curr = document.querySelector(".curr");
const ops = ["add", "subtract", "multiply", "divide", "operate"];
let count = 0;

operands.addEventListener("click", (e) => {
  console.log(`count = ${count}`);
  if(e.target.id !== "operate"){
    if(count > 0) last.textContent = "";
    if(ops.includes(e.target.id)){
      if(count > 0) count --;
      if(!curr.textContent.includes(" ")){
        switch(e.target.id) {
          case "add":
            curr.textContent += " + ";
            break;
          case "subtract":
            curr.textContent += " - ";
            break;
          case "multiply":
            curr.textContent += " * ";
            break;
          case "divide":
            curr.textContent += " / ";
            break;
        }
      }
    }else if(curr.textContent === "0"){
      if(e.target.id === "0"){
        ;
      } else {
        curr.textContent = e.target.id;
      }
    } else {
      if(count > 0){
        curr.textContent = e.target.id;
        count --;
      } else {
      curr.textContent += e.target.id;
      }
    }
  }
})

operate.addEventListener("click", () => {
  if(!(curr.textContent.slice(-1) === " ") && curr.textContent.includes(" ")){
    last.textContent = curr.textContent;
    count ++;
    return curr.textContent = powerCalc.calculate(curr.textContent);
  }
})
