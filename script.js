// This calculator is going to contain functions of basic math operators
// Create function add, subtract, multiply, divide
function add(a, b) {
  return +a + +b;
}

function subtract(a, b) {
  return +a - +b;
}

function multiply(a, b) {
  return +a * +b;
}

function divide(a, b) {
  return +a / +b;
}

const outerBtnsContainer = document.querySelector("#outer-btns-container");
const operateSign = document.querySelector("#operate");
const realTimeDisplay = document.querySelector("#real-time");
const historyDisplay = document.querySelector("#history");
// A calculator operation will consist of a number, an operator, and another number.
// For example, 3 + 5.
// Create variable for numOne, numTwo and operator
let numOne = "0";
let numTwo = "";
let operator = "";
let operation = "";
let lastResult = "";
// Create function operate that can passed in numOne, operator and numTwo as argument
// and call the corresponding functions of operator and return the result
function operate(numOne, numTwo, operator) {
  // If operator equals to add
  // Call add(numOne, numTwo)
  // If operator equals to subtract
  // Call subtract(numOne, numTwo)
  // If operator equals to multiply
  // Call multiply(numOne, numTwo)
  // If operator equals to divide
  // Call divide(numOne, numTwo)
  switch (operator) {
    case "+":
      return add(numOne, numTwo);
      break;
    case "−":
      return subtract(numOne, numTwo);
      break;
    case "×":
      return multiply(numOne, numTwo);
      break;
    case "÷":
      return divide(numOne, numTwo);
      break;
    default:
      console.log("An unknown operator");
  }
}
// Add event listener of click event to buttons on calculator and register even handler 
// that update variable numOne, operator, numTwo and update display
// ** Don't let user type more than one decimal separator for a num
outerBtnsContainer.addEventListener("click", (e) => {
  console.log(e.target.classList);
  if (
    e.target.id === "outer-btns-container" ||
    e.target.classList[0] === "btns-container" ||
    e.target.id === "operate"
  ) {
    return;
  }
  historyDisplay.textContent = "";
  const btn = e.target;
  // If btn.classList[0] doesn't equal to "operator"

  // If operator doesn't exist
  // Add btn.textContent to numOne
  
  
  if (btn.classList[0] !== "operator") {
    lastResult = "";
    if (!operator) {
      if (numOne === "0") {
        numOne = btn.textContent;
      } else {
        numOne += btn.textContent;
      }
    } else {
      if (numTwo === "0") {
        numTwo = btn.textContent;
      } else {
        numTwo += btn.textContent;
      }
    }
  } else if (!operator) {
    operator = btn.textContent;
    if (!numOne) {
      numOne = lastResult;
    }
  }

  console.log(`lastResult: ${lastResult}`);
  console.log(`numOne: ${numOne}`)
  console.log(`numTwo: ${numTwo}`);
  console.log(`operator: ${operator}`);
  operation = `${numOne} ${operator} ${numTwo}`
  realTimeDisplay.textContent = operation;
});
// Add event listener of click event to "=" button and register even handler 
// that Call operate() and update the display
operateSign.addEventListener("click", () => {
  lastResult = operate(numOne, numTwo, operator);
  realTimeDisplay.textContent = lastResult;
  console.log(`result: ${lastResult}`);
  historyDisplay.textContent = operation;
  numOne = "";
  numTwo = "";
  operator = "";
});
// ** This calculator should not evaluate more than a single pair of numbers at a time
// Enter a number (12).
// Enter an operator (+).
// Enter a second number (7).
// Enter a second operator (-). At this point, it should evaluate the initial pair of numbers (12 + 7), then display the result (19).
// Enter another number (1).
// Enter another operator or equals sign (=). At this point, it should use the previous result (19) as the first number, the operator (-), and the new number (1) to calculate the new equation 19 - 1. You should see the result (18) on the display.
// round answers with long decimals so that they don’t overflow the display
// Pressing = before entering all of the numbers or an operator could cause problems!
// Pressing “clear” should wipe out any existing data. Make sure the user is really starting fresh after pressing “clear”.
// Display a snarky error message if the user tries to divide by 0… and don’t let it crash your calculator!
// Make sure that your calculator only runs an operation when supplied with two numbers and an operator by the user. Example: you enter a number (2), followed by an operator button (+). You press the operator button (+) a second consecutive time. Your calculator should not evaluate this as (2 + 2) and should not display the result (4). If consecutive operator buttons are pressed, your calculator should not run any evaluations, it should only take the last operator entered to be used for the next operation.
// When a result is displayed, pressing a new digit should clear the result and start a new calculation

// Extra credit
// Add keyboard support!

