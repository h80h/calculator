const powerCalc = new Calculator;
const operands = document.querySelector(".operands");
const operate = document.querySelector("#operate");
const curr = document.querySelector(".curr");
const last = document.querySelector(".last");
const ops = ["add", "subtract", "multiply", "divide"];
let result = "";
let decimalCount = 1;
let newCount = 1;
let reuseCount = 0;

// the calculator constructor
function Calculator() {
  // four kinds operations
  this.methods = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };

  // method calculate
  this.calculate = (operation) => {
    // get operands from string which separate them with spaces
    let splited = operation.split(" ");
    let op = splited[1];
    let a = splited[0];
    if(reuseCount === 1){
      a = result;
    };
    let b = splited[2];

    last.textContent = a + " " + op + " " + b;
    if(last.textContent.length > 15){
      last.setAttribute("style", "font-size: 16px");
    };
    
    // calculate to get result by using one of property in methods property
    // also set an error scenario
    if(op === "/" && +b === 0){
      result = "error";
    } else {
      result = (parseFloat((this.methods[op](+a, +b)).toFixed(8))).toString();
    };

    
    // round result for better display
    let rounded = round(result);

    function round(){
      let decimalIndex = result.indexOf(".");
      if(result >= 100000000){
        return (+(result)).toExponential(3);
      } else if(decimalIndex != "-1"){
        return parseFloat((+result).toFixed(8-decimalIndex));
      } else {
        return result;
      };
    };
    
    // reset value after calculation
    decimalCount = 1;
    newCount = 1;
    reuseCount = 0;
    curr.setAttribute("style", "font-size: 36px");

    // return rounded result at the end
    return rounded;
  };
}

// Add an click event handler to operands object
operands.addEventListener("click", (e) => {
  // #operate & #reset are in operands object,
  // but they don't take part in forming operation string

  // all the operands shouldn't work after getting "error"
  // until it's got erased(by reset or refresh the webpage)
  if(e.target.id !== "operate" && e.target.id !== "reset" && result !== "error"){
    // when it's the very start of a new calc, empty the last.textContent
    // #backward isn't allow to work in the very beginning of calc
    if(newCount === 1 && e.target.id !== "backward") last.textContent = "";
    // Give ops(#add, #subtract, #multiply, #divide), #decimal, #backward
    // respective else if statement & discuss whether curr.textContent is "0" at the end
    if(ops.includes(e.target.id)){      
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
        // After input the operator in operation string,
        // the following input will be the second operand, it can contain only 1 decimal
        decimalCount = 1;
        // If operator is inputted right after the last calculation,
        // the last result can be reuse
        // If the result is empty, it can't be reuse
        if(newCount === 1 && result !== "") reuseCount = 1;
        // After any input, it's not a new calc then
        newCount = 0;
      }
    } else if(e.target.id === "decimal"){
      if(decimalCount === 1){
        // In the very beginning of a calc, the operation string should be reset
        // except inputting operators
        
        // Decimal should follow after number
        if(newCount === 1){
          curr.textContent = "0."
          newCount = 0;
        // scenario when input decimal after operators without inputting numbers first
        } else if(curr.textContent.slice(-1) === " "){
          curr.textContent += "0.";
        } else {
          curr.textContent += ".";
        }
        // The only decimal had been given to the operand, it can't contain another
        decimalCount = 0;
      }
    } else if(e.target.id === "backward"){
      // The default of operation string is "0", so #backward shouldn't work when it's "0"
      
      // #backward isn't allow to work in the very beginning of calc,
      // it can finally start working when there are already other inputs after new calc
      if(curr.textContent !== "0" && newCount === 0){
        if([" + ", " - ", " * ", " / "].includes(curr.textContent.slice(-3))){
          curr.textContent = curr.textContent.slice(0, -3);
          // When operator was input, the decimalCount was set to 1 for second operand
          // While now we erase the operator from operation string,
          // it's not OK that 1st operand which is a decimal to input 2nd decimal later
          if(curr.textContent.indexOf(".") !== -1) decimalCount = 0;
          // Only when an operator is inputted right after the last calculation,
          // the last result can be reused
          // Now there's no operator in operation string, it can't be reused
          reuseCount = 0;
        // When erasing the only char in operation string,
        // we need to set the string back to "0" the default value
        } else if(curr.textContent.length === 1) {
          curr.textContent = "0";
        // If the 1st operand isn't a decimal, we reserve 1 decimal for it
        } else {
          if(curr.textContent.slice(-1) === ".") decimalCount = 1;
          curr.textContent = curr.textContent.slice(0, -1);
        }
        newCount = 0;

        // Resize the font of operation string according to string length after modify
        if(curr.textContent.includes(".")){
          switch(curr.textContent.length){
            case 9:
              curr.setAttribute("style", "font-size: 36px");
              break;
            case 10:
              curr.setAttribute("style", "font-size: 32px");
              break;
            case 11:
              curr.setAttribute("style", "font-size: 30px");
              break;
          }
        } else {
          switch(curr.textContent.length){
            case 8:
              curr.setAttribute("style", "font-size: 36px");
              break;
            case 9:
              curr.setAttribute("style", "font-size: 32px");
              break;
            case 10:
              curr.setAttribute("style", "font-size: 30px");
              break;
          }
        }
      }
    // In any scenario, when operation string is "0", all number inputs rewrite it directly
    } else if(curr.textContent === "0"){
      curr.textContent = e.target.id;
      newCount = 0;
    // All number input rewite the operation string right after very start of new calc
    } else {
      if(newCount === 1){
        curr.textContent = e.target.id;
        newCount = 0;
      // Scenario when already input a "0" right after operator
      // it's not OK to have operand which looks like "01" or "02" etc...
      } else if(curr.textContent.slice(-2) === " 0"){
        curr.textContent = curr.textContent.slice(0, -1) + e.target.id;
      } else {
        curr.textContent += e.target.id;
      }
    };

    // Resize the font of operation string according to string length after inputing
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

  // Though #reset don't take part in forming operation string,
  // it can reset values to the defult
  if(e.target.id === "reset"){
    curr.textContent = "0";
    last.textContent = "";
    decimalCount = 1;
    newCount = 1;
    result = "";
    reuseCount = 0;
    curr.setAttribute("style", "font-size: 36px");
  }
})

// Add an click event handler to operate object (the equal sign)
operate.addEventListener("click", () => {
  // The operation only execute when we got a pair of operands & an operator:
  // the last char of operation string won't be " ",
  // if it's " ", it must be a operator

  // And an operator is also needed for operating!
  if(!(curr.textContent.slice(-1) === " ") && curr.textContent.includes(" ")){
    // reset the font size of last.textContent before it shows for the coming result 
    last.setAttribute("style", "font-size: 20px");
    return curr.textContent = powerCalc.calculate(curr.textContent);
  }
})
