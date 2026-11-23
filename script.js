function add(a, b) {return +a + +b;}
function subtract(a, b) {return +a - +b;}
function multiply(a, b) {return +a * +b;}
function divide(a, b) {return +a / +b;}

function roundNum(num, decimalPlace) {
  return Math.round(num * 10 ** decimalPlace) / 10 ** decimalPlace;
}

// Fix position issue of minus sign of negative number with rtl direction
function moveMinusSign(num) {
  // if (num < 0) {return `${num.slice(1)}-`;}
  if (num < 0) {
    return num.slice(1) + "-";
  }
  return num;
}

// Fix position issue of decimal point with rtl direction
function moveDecimalPoint(num) {
  return num.endsWith(".") 
    ? "." + moveMinusSign(num.slice(0, -1)) 
    : moveMinusSign(num);
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
  // Disable all event handler if isLastResultAnError is true except allClear's click event listener
  let isLastResultAnError = false;

  const realTimeDisplayObj = new Display(realTimeDisplay);
  const historyDisplayObj = new Display(historyDisplay);
  realTimeDisplayObj.default = realTimeDisplay.querySelector(".default");

  function Display(part) {
    this.numOne = part.querySelector(".num-one");
    this.numTwo = part.querySelector(".num-two");
    this.operator = part.querySelector(".operator");

    this.updateDisplay = function() {
      this.numTwo.textContent = moveDecimalPoint(numTwo);
      this.operator.textContent = moveDecimalPoint(operator);
      this.numOne.textContent = moveDecimalPoint(numOne);
    };

    this.clearDisplay = function() {
      this.operator.textContent = "";
      this.numOne.textContent = "";
    };

    this.removeHidden = function(part) {
      if (this[part].classList[1]) {
        this[part].classList.remove("hidden");
      }
    };

    this.addHidden = function(part) {
      if (!this[part].classList[1]) {
        this[part].classList.add("hidden");
      }
    }
  }

  function operate(numOne, numTwo, operator) {
    const operation =
      operator === "+"
        ? add
        : operator === "-"
          ? subtract
          : operator === "×"
            ? multiply
            : operator === "÷"
              ? divide
              : undefined;

    if (operation === divide && numTwo == 0) {
      isLastResultAnError = true;
      return "Error";
    }
    const result = operation(numOne, numTwo);
    const resultStr = String(result);
    console.log(`result: ${result}`);

    // Declare lengthOfInt and eTimes to help with truncating the result to output
    let lengthOfInt;
    let eTimes;
    let output;

    // Set proper tools for truncating
    if (!resultStr.includes("e+") && !resultStr.includes("e-")) {
      lengthOfInt = String(Math.floor(result < 0 ? -result : result)).length;
    } else {
      eTimes = +resultStr.slice(resultStr.indexOf("e") + 1);
      console.log(`eTimes: ${eTimes}`);
    }

    // the result will overflow the display if its length is longer than 11 chars
    // reserve a slot for next operator, so limit the display of result to 10 chars at most (excluding decimal point)
    if (resultStr.length > 10) {
      if (eTimes) {
        // Truncate the e notation by round the real number on its left side
        // Round to 4 decimal place to not overflow the display
        let roundedResult = roundNum(result / 10 ** eTimes, 4);
        if (roundedResult === 10) {
          roundedResult = 1;
          eTimes = eTimes + 1;
        }
        output = roundedResult + `e${eTimes}`;
      } else if (lengthOfInt === 1) {
        output = roundNum(result, 9);
      } else if (lengthOfInt > 10) {
        // Round the result into an e notation
        output =
          roundNum(result / 10 ** (lengthOfInt - 1), 6) + `e${lengthOfInt - 1}`;
      } else {
        output = roundNum(result, 10 - lengthOfInt);
      }
    } else {
      output = result;
    }

    console.log(`output: ${output}`);
    console.log(`String(output): ${String(output)}`);
    return String(output);
  }

  function resetAllVariables() {
    numOne = "0";
    numTwo = "";
    operator = "";
    lastResult = "";
    isLastResultAnError = false;
    realTimeDisplayObj.clearDisplay();
    realTimeDisplayObj.numTwo.textContent = "";
    realTimeDisplayObj.addHidden("numTwo");
    realTimeDisplayObj.addHidden("operator");
    realTimeDisplayObj.addHidden("numOne");
    historyDisplayObj.clearDisplay();
    historyDisplayObj.numTwo.textContent = "";
    console.log("reset!");
  }

  // Let user input operation which is formed by numOne, numTwo and operator
  outerBtnsContainer.addEventListener("click", (e) => {
    if (
      e.target === outerBtnsContainer ||
      e.target.classList[0] === "btns-container" ||
      e.target === operateSign ||
      e.target === allClear ||
      isLastResultAnError
    ) return;

    realTimeDisplayObj.addHidden("default");
    const btn = e.target;
    const btnText = btn.textContent;

    if (btn.classList[0] !== "operator") {
      // if clicking digit buttons right after operating
      // start a new operation with all variables being reset
      if (lastResult) resetAllVariables();
      if (!operator) {
        if (!numOne.includes(".") || btnText !== ".") {
          realTimeDisplayObj.removeHidden("numOne");
          numOne === "0" && btnText !== "."
            ? (numOne = btnText)
            : (numOne += btnText);
        }
      } else {
        if (!numTwo.includes(".") || btnText !== ".") {
        realTimeDisplayObj.removeHidden("numTwo");
          numTwo === "0" && btnText !== "."
            ? (numTwo = btnText)
            : numTwo === "" && btnText === "."
              ? (numTwo = "0.")
              : (numTwo += btnText);
        }
      }
    } else {
      // If lastResult exists
      // Reset lastResult and numTwo and then Set operator to btnText
      if (lastResult) {
        // numOne got set to be lastResult after operating
        // if select operator without clicking digit button first after operating
        // start a new operation with lastResult as numOne
        // and reset the lastResult, numTwo
        // and Reassign operator according to the clicked .operator
        lastResult = "";
        numTwo = "";
        operator = btnText;
        realTimeDisplayObj.addHidden("numTwo");
        historyDisplayObj.clearDisplay();
        historyDisplayObj.numTwo.textContent = "";
      } else if (!numTwo) {
        realTimeDisplayObj.addHidden("numTwo");
        realTimeDisplayObj.removeHidden("numOne");
        realTimeDisplayObj.removeHidden("operator");
        operator = btnText;
      } else {
        // Auto operate if user enters extra operator when numTwo exists
        const nextOperator = btnText;
        lastResult = operate(numOne, numTwo, operator);
        console.log(
          "triggered by extra operator:\n" + `${numOne} ${operator} ${numTwo}`,
        );
        historyDisplayObj.updateDisplay();
        if (isLastResultAnError) {
          realTimeDisplayObj.clearDisplay();
          realTimeDisplayObj.numTwo.textContent = "Error";
        } else {
          // start a new operation with lastResult as numOne, nextOperator as operator
          numOne = lastResult;
          operator = nextOperator;
          lastResult = "";
          numTwo = "";
          realTimeDisplayObj.updateDisplay();
          realTimeDisplayObj.addHidden("numTwo");
        }
        return;
      }
    }
    realTimeDisplayObj.updateDisplay();
  });

  // Let user manually trigger the operating
  operateSign.addEventListener("click", () => {
    // the calculator only operates when numOne, numTwo and operator all exist
    // if numTwo is set to be some value according to which digit button got pressed
    // and it starts to exist, then operator absolutely exists
    // if operator exists, then numOne absolutely exists
    if (!numTwo || isLastResultAnError) return;
    lastResult = operate(numOne, numTwo, operator);
    console.log("triggered by user:\n" + `${numOne} ${operator} ${numTwo}`);
    realTimeDisplayObj.clearDisplay();
    realTimeDisplayObj.numTwo.textContent = moveMinusSign(lastResult);
    historyDisplayObj.updateDisplay();
    // start a new operation with lastResult as numOne
    if (!isLastResultAnError) numOne = lastResult;
  });

  // Make the whole calculator reset
  allClear.addEventListener("click", () => {
    resetAllVariables();
    realTimeDisplayObj.removeHidden("default");
    console.log("Restart from 0");
  });
}

startCalculator();

// Extra credit
// Add keyboard support!

