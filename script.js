function add(a, b) {return +a + +b;}
function subtract(a, b) {return +a - +b;}
function multiply(a, b) {return +a * +b;}
function divide(a, b) {return +a / +b;}

function operate(numOne, numTwo, operator) {
  const operation =
    operator === "+"
      ? add
      : operator === "−"
        ? subtract
        : operator === "×"
          ? multiply
          : operator === "÷" ? divide : undefined;
  
  return operation(numOne, numTwo);
}

function startCalculator() {
  const outerBtnsContainer = document.querySelector("#outer-btns-container");
  const operateSign = document.querySelector("#operate");
  const realTimeDisplay = document.querySelector("#real-time");
  const historyDisplay = document.querySelector("#history");
  const allClear = document.querySelector("#all-clear");

  // Declare numOne, numTwo, operator and lastResult which is target output 
  // that can determine whether to start a complete new operation or can be reused as numOne
  let numOne = "0";
  let numTwo = "";
  let operator = "";
  let lastResult = "";

  function resetAllVariables() {
    numOne = "0";
    numTwo = "";
    operator = "";
    lastResult = "";
    historyDisplay.textContent = "";
    console.log("reset!");
  }

  // Let user input operation which is formed by numOne, numTwo and operator
  // ** Don't let user enter more than one decimal separator for a num
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

    if (btn.classList[0] !== "operator") {
      if (String(lastResult)) {
        // if clicking digit buttons right after operating
        // start a new operation with all variables being reset
        resetAllVariables();
      }

      if (!operator) {
        numOne === "0"
          ? (numOne = btn.textContent)
          : (numOne += btn.textContent);
      } else {
        numTwo === "0"
          ? (numTwo = btn.textContent)
          : (numTwo += btn.textContent);
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
        // Auto operate if user enters extra operator when numTwo exists
        const nextOperator = btn.textContent;
        lastResult = operate(numOne, numTwo, operator);
        console.log("triggered by extra operator:\n" + `${numOne} ${operator} ${numTwo}`);
        historyDisplay.textContent = `${numOne} ${operator} ${numTwo}`;
        // start a new operation with lastResult as numOne, nextOperator as operator
        numOne = lastResult;
        operator = nextOperator;
        lastResult = "";
        numTwo = "";
      }
    }

    realTimeDisplay.textContent = `${numOne} ${operator} ${numTwo}`;
  });

  // Let user manually trigger the operating
  operateSign.addEventListener("click", () => {
    // the calculator only operates when numOne, numTwo and operator all exist
    // if numTwo is set to be some value according to what digit button got pressed
    // and start to exist
    // operator absolutely exists
    // if operator exists
    // numOne absolutely exists
    if (!numTwo) return;
    lastResult = operate(numOne, numTwo, operator);
    console.log("triggered by user:\n"+`${numOne} ${operator} ${numTwo}`);
    realTimeDisplay.textContent = lastResult;
    historyDisplay.textContent = `${numOne} ${operator} ${numTwo}`;
    // start a new operation with lastResult as numOne
    numOne = lastResult;
  });

  // Make the whole calculator reset
  allClear.addEventListener("click", () => {
    resetAllVariables();

    realTimeDisplay.textContent = "0";
    console.log("Restart from 0");
  });
}

startCalculator();

// round answers with long decimals so that they don’t overflow the display
// Pressing = before entering all of the numbers or an operator could cause problems!
// Display a snarky error message if the user tries to divide by 0… and don’t let it crash your calculator!

// Extra credit
// Add keyboard support!

