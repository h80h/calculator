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
    
    let result = (this.methods[op](a, b)).toFixed(8);
    console.log(`result = ${result}`);
    let rounded = round(result);

    function round(){
      let decimalIndex = result.indexOf(".")
      if(result >= 100000000){
        let exponen = (+(result)).toExponential();
        console.log(`exponen = ${exponen}`);
        let exponenStr = exponen.toString();
        if(exponenStr.length > 9){
          let eIndex = exponenStr.indexOf("e");
          let a = 9 - (exponenStr.length - eIndex) + 1;

          return (+exponen.slice(0, a)).toFixed(a - 3) + exponen.slice(eIndex);
        } else {
          return exponen;
        }
        
      } else if(decimalIndex != "-1"){
        return (+result).toFixed(8-decimalIndex)
      } else {
        return result;
      }
    }

    while(rounded.slice(-1) === "0"){
      rounded = rounded.slice(0, -1);
    }
    if(rounded.slice(-1) === "."){
      rounded = rounded.slice(0, -1);
    }

    return rounded;
  };
}

const powerCalc = new Calculator;
const last = document.querySelector(".last");
const operands = document.querySelector(".operands");
const operate = document.querySelector("#operate");
const curr = document.querySelector(".curr");
const ops = ["add", "subtract", "multiply", "divide", "operate"];
let decimalCount = 1;
let newCount = 0;

operands.addEventListener("click", (e) => {
  console.log(`newCount = ${newCount}`);
  console.log(`decimalCount = ${decimalCount}`)
  if(e.target.id !== "operate"){
    if(newCount > 0) last.textContent = "";
    if(ops.includes(e.target.id)){
      if(newCount > 0) newCount --;
      if(decimalCount < 1) decimalCount ++;
      last.setAttribute("style", "font-size: 20px")
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
    } else if(e.target.id === "decimal"){
      if(decimalCount > 0){
        if(newCount > 0){
          curr.textContent = "0."
          newCount --;
        } else if(curr.textContent.slice(-1) === " "){
          curr.textContent += "0.";
        } else {
          curr.textContent += ".";
        }
        decimalCount --;
      }
    } else if(curr.textContent === "0"){
      if(e.target.id === "0"){
        ;
      } else {
        curr.textContent = e.target.id;
      }
    } else {
      if(newCount > 0){
        curr.textContent = e.target.id;
        newCount --;
      } else if(curr.textContent.slice(-2) === " 0"){
        curr.textContent = curr.textContent.slice(0, -1) + e.target.id;
      } else {
      curr.textContent += e.target.id;
      }
    }
    if(curr.textContent.includes(".")){
      switch(curr.textContent.length){
        case 10:
          curr.setAttribute("style", "font-size: 32px");
          break;
        case 11:
          curr.setAttribute("style", "font-size: 30px");
          break;
        case 12:
          curr.setAttribute("style", "font-size: 28px");
          break;
      }
    } else {
      switch(curr.textContent.length){
        case 9:
          curr.setAttribute("style", "font-size: 32px");
          break;
        case 10:
          curr.setAttribute("style", "font-size: 30px");
          break;
        case 11:
          curr.setAttribute("style", "font-size: 28px");
          break;
      }
    }
  }
})

operate.addEventListener("click", () => {
  if(!(curr.textContent.slice(-1) === " ") && curr.textContent.includes(" ")){
    last.textContent = curr.textContent;
    if(last.textContent.length > 15){
      last.setAttribute("style", "font-size: 16px")
    };

    curr.setAttribute("style", "font-size: 36px");
    newCount ++;
    if(decimalCount < 1) decimalCount++;
    return curr.textContent = powerCalc.calculate(curr.textContent);
  }
})
