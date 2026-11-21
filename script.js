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

// Create function operate that can passed in numOne, operator and numTwo as argument
// and call the corresponding functions of operator and return the result
function operate(numOne, numTwo, operator) {
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

const outerBtnsContainer = document.querySelector("#outer-btns-container");
const operateSign = document.querySelector("#operate");
const realTimeDisplay = document.querySelector("#real-time");
const historyDisplay = document.querySelector("#history");
const allClear = document.querySelector("#all-clear");
// A calculator operation will consist of a number, an operator, and another number.
// For example, 3 + 5.
// Create variable for numOne, numTwo and operator
let numOne = "0";
let numTwo = "";
let operator = "";
let lastResult = "";

// Declare resetAllVariables function
function resetAllVariables() {
  numOne = "0";
  numTwo = "";
  operator = "";
  lastResult = "";
  historyDisplay.textContent = "";
  console.log("reset!")
}
// Add event listener of click event to buttons on calculator and register even handler 
// that update variable numOne, operator, numTwo and update display
// ** Don't let user type more than one decimal separator for a num
outerBtnsContainer.addEventListener("click", (e) => {
  if (
    e.target === outerBtnsContainer ||
    e.target.classList[0] === "btns-container" ||
    e.target === operateSign ||
    e.target === allClear
  ) {
    return;
  }

  const btn = e.target;
  // If btn.classList[0] doesn't equal to "operator"
    // If lastResult exists
     // call resetAllVariables()
    // If operator doesn't exist
      // If numOne equals to "0"
        // Set btn.textContent to numOne
      // Else
        // Add btn.textContent to numOne and assign result back to numOne
    // Else
      // If numTwo equals to "0"
        // Set btn.textContent to numTwo
      // Else
        // Add btn.textContent to numTwo and assign result back to numTwo
  if (btn.classList[0] !== "operator") {
    if (String(lastResult)) {
      // if clicking digit buttons right after operating
      // start a new operation with all variables being reset
      resetAllVariables();
    }

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
  } else {
    // If lastResult exists
    // Reset lastResult and numTwo and then Set operator to btn.textContent
    if (String(lastResult)) {
      // numOne got set to be lastResult after operating
      // if select operator without clicking digit button first after operating
      // start a new operation with lastResult as numOne
      // and reset the lastResult, numTwo
      // and Reassign operator according to the clicked .operator
      lastResult = "";
      numTwo = "";
      operator = btn.textContent;
      historyDisplay.textContent = "";
    } else if (!numTwo) {
      operator = btn.textContent;
    } else {
      // nextOperator = btn.textContent;
    }
  }

  console.log(`lastResult: ${lastResult}`);
  console.log(`numOne: ${numOne}`);
  console.log(`numTwo: ${numTwo}`);
  console.log(`operator: ${operator}`);
  realTimeDisplay.textContent = `${numOne} ${operator} ${numTwo}`;
});
// Add event listener of click event to "=" button and register even handler 
// that Call operate() and update the display
operateSign.addEventListener("click", () => {
  // only operate when numOne, numTwo and operator all exist
  // if numTwo is set to be some value according to the digit button being pressed
  // and start to exist
  // operator absolutely exists
  // if operator exists
  // numOne absolutely exists
  if (!numTwo) return;
  lastResult = operate(numOne, numTwo, operator);
  realTimeDisplay.textContent = lastResult;
  console.log(`operation result: ${lastResult}`);
  historyDisplay.textContent = `${numOne} ${operator} ${numTwo}`;
  // start a new operation with lastResult as numOne
  numOne = lastResult;
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
allClear.addEventListener("click", () => {
  resetAllVariables();

  realTimeDisplay.textContent = "0";
  console.log("Restart from 0");
});
// Display a snarky error message if the user tries to divide by 0… and don’t let it crash your calculator!
// Make sure that your calculator only runs an operation when supplied with two numbers and an operator by the user. Example: you enter a number (2), followed by an operator button (+). You press the operator button (+) a second consecutive time. Your calculator should not evaluate this as (2 + 2) and should not display the result (4). If consecutive operator buttons are pressed, your calculator should not run any evaluations, it should only take the last operator entered to be used for the next operation.
// When a result is displayed, pressing a new digit should clear the result and start a new calculation

// Extra credit
// Add keyboard support!

