function add(a, b) {return +a + +b;}
function subtract(a, b) {return +a - +b;}
function multiply(a, b) {return +a * +b;}
function divide(a, b) {return +a / +b;}

function roundNum(num, decimalPlace) {
  return Math.round(num * 10 ** decimalPlace) / 10 ** decimalPlace;
}

function startCalculator() {
  const operandsContainer = document.querySelector("#outer-btns-container>div:first-child");
  const operatorsContainer = document.querySelector("#operators-container");
  const operateSign = document.querySelector("#operate");
  const realTimeDisplay = document.querySelector("#real-time");
  const historyDisplay = document.querySelector("#history");
  const allClear = document.querySelector("#all-clear");
  const negation = document.querySelector("#negation")

  // Declare numOne, operator, numTwo and lastResult which is target output
  // that can determine whether to start a complete new operation or can be reused as numOne
  let numOne = "0";
  let operator = "";
  let numTwo = "";
  let lastResult = "";
  // Disable all event handler if isLastResultAnError is true except allClear's click event listener
  let isLastResultAnError = false;

  function Display(part) {
    this.numOne = part.querySelector(".num-one");
    this.numTwo = part.querySelector(".num-two");
    this.operator = part.querySelector(".operator");

    this.setText = function (part, content) {
      this[part].textContent = content;
    };

    this.clearDisplay = function () {
      this.setText("operator", "");
      this.setText("numTwo", "");
    };
  }

  const realTimeDisplayObj = new Display(realTimeDisplay);
  const historyDisplayObj = new Display(historyDisplay);

  realTimeDisplayObj.removeHidden = function (part) {
    if (this[part].classList[1]) {
      this[part].classList.remove("hidden");
      console.log(`remove hidden from ${part}`);
    }
  };

  realTimeDisplayObj.hideDisplay = function () {
    this.operator.classList.add("hidden");
    this.numTwo.classList.add("hidden");
  };

  historyDisplayObj.updateDisplay = function () {
    this.setText("numOne", numOne);
    this.setText("operator", operator);
    this.setText("numTwo", numTwo);
  };

  historyDisplayObj.clearAllDisplay = function () {
    this.clearDisplay();
    this.setText("numOne", "");
  };

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
    return String(output);
  }

  function resetLastResultAndNumTwo() {
    lastResult = "";
    numTwo = "";
  }

  function resetAllVariables() {
    numOne = "0";
    operator = "";
    resetLastResultAndNumTwo();
    isLastResultAnError = false;
    historyDisplayObj.clearAllDisplay();
    realTimeDisplayObj.clearDisplay();
    realTimeDisplayObj.hideDisplay();
    console.log("reset!");
  }

  // Let user input operation which is formed by numOne, numTwo and operator
  // Create two event listeners for readability
  // This for operands, next for operator
  operandsContainer.addEventListener("click", (e) => {
    if (
      e.target === operandsContainer ||
      e.target.classList[0] === "btns-container" ||
      e.target === allClear ||
      isLastResultAnError
    )
      return;

    const btn = e.target;
    const btnText = btn.textContent;

    // if clicking digit buttons right after operating
    // start a new operation with all variables being reset
    // else if it's the negation button being clicked
    // use lastResult as numOne which was set after clicking operateSign
    // and reset other variables of operation and clear history
    if (lastResult) {
      if (btn !== negation) {
        resetAllVariables();
      } else {
        operator = "";
        resetLastResultAndNumTwo();
        historyDisplayObj.clearAllDisplay();
      }
    }

    function Operand(name, value) {
      this.name = name;
      this.value = value;
      this.define = function (concatDigit, assignValue, removeHidden) {
        if (!this.value.includes(".") || btnText !== ".") {
          // Operand can be negate while being defined
          if (btn === negation) {
            // this case explains why not to set "0" as numTwo's default value
            if (this.value && this.value !== "0") {
              if (this.value[0] !== "-") {
                this.value = "-" + this.value;
              } else {
                this.value = this.value.slice(1);
              }
              assignValue(this);
              console.log(`negate ${this.name}!`);
            } else return;
          } else {
            concatDigit(this);
          }
          if (this.value[0] === "-") {
            this.value = `(${this.value})`;
          }
          console.log(`${this.name}: ${this.value}`);
          realTimeDisplayObj.setText(this.name, this.value);
          if (removeHidden) removeHidden(this);
        }
      };
    }
    // numOne can be defined before operand doesn't exist
    // numTwo can be defined before a new triggered operating
    if (!operator) {
      const numOneObj = new Operand("numOne", numOne);
      numOneObj.define(
        (operand) => {
          numOne === "0" && btnText !== "."
            ? (numOne = btnText)
            : (numOne += btnText);
          operand.value = numOne;
        },
        (operand) => (numOne = operand.value),
      );
    } else {
      const numTwoObj = new Operand("numTwo", numTwo);
      numTwoObj.define(
        (operand) => {
          numTwo === "0" && btnText !== "."
            ? (numTwo = btnText)
            : numTwo === "" && btnText === "."
              ? (numTwo = "0.")
              : (numTwo += btnText);
          operand.value = numTwo;
        },
        (operand) => (numTwo = operand.value),
        (operand) => {
          realTimeDisplayObj.removeHidden(operand.name);
        },
      );
    }
  });

  // Let user choose operator for new operation of which numOne may be entered by user
  // or may be lastResult of operating triggered by pressing operateSign
  // or may be lastResult of operating triggered by entering an extra operator to an operation
  operatorsContainer.addEventListener("click", (e) => {
    if (e.target.classList[0] !== "operator" || isLastResultAnError) return;

    const btn = e.target;
    const btnText = btn.id;

    // If lastResult exists
    // Reset lastResult and numTwo and then Set operator to be btnText
    if (lastResult) {
      // numOne got set to be lastResult after operating
      // if select operator without clicking digit button first after operating
      // start a new operation with lastResult as numOne
      // and reset the lastResult, numTwo
      // and Reassign operator according to the clicked .operator
      resetLastResultAndNumTwo();
      operator = btnText;
      historyDisplayObj.clearAllDisplay();
    } else if (!numTwo) {
      // this case also explains why not to set "0" as numTwo's default value
      // operator should be alterable before user enters numTwo
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
        realTimeDisplayObj.hideDisplay();
        realTimeDisplayObj.setText("numOne", "Error");
        return;
      } else {
        // start a new operation with lastResult as numOne, nextOperator as operator
        numOne = lastResult;
        operator = nextOperator;
        resetLastResultAndNumTwo();
        realTimeDisplayObj.numTwo.classList.add("hidden");
        realTimeDisplayObj.setText("numOne", numOne);
      }
    }
    realTimeDisplayObj.setText("operator", operator);
    realTimeDisplayObj.removeHidden("operator");
  });

  // Let user manually trigger the operating
  operateSign.addEventListener("click", () => {
    // the calculator only operates when numOne, numTwo and operator all exist
    // if numTwo is set to be some value according to which digit button got pressed
    // and it starts to exist, then operator absolutely exists
    // if operator exists, then numOne absolutely exists
    if (!numTwo || isLastResultAnError) return;
    if (!realTimeDisplayObj.numTwo.classList[1]) {
      realTimeDisplayObj.hideDisplay();
    }
    lastResult = operate(numOne, numTwo, operator);
    console.log("triggered by user:\n" + `${numOne} ${operator} ${numTwo}`);
    historyDisplayObj.updateDisplay();
    realTimeDisplayObj.setText("numOne", lastResult);
    // start a new operation with lastResult as numOne
    if (!isLastResultAnError) numOne = lastResult;
  });

  // Make the whole calculator reset
  allClear.addEventListener("click", () => {
    resetAllVariables();
    realTimeDisplayObj.setText("numOne", "0");
    console.log("Restart from 0");
  });
}

startCalculator();

// Extra credit
// Add keyboard support!

