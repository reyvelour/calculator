const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalButton = document.querySelector('.equal');
const clearButton = document.querySelector('.clear');
const decimalButton = document.querySelector('.decimal');
const backspaceButton = document.querySelector('.backspace');

let currentInput = '';
let previousValue = null;
let operator = null;
let shouldResetScreen = false;

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? "Error" : a / b; }

function operate(op, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  if (isNaN(a) || isNaN(b)) return '';
  switch (op) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '*': return multiply(a, b);
    case '/': return divide(a, b);
    default: return b;
  }
}

function updateDisplay(value) {
  display.textContent = value.toString().substring(0, 12);
}

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (shouldResetScreen) {
      currentInput = '';
      shouldResetScreen = false;
    }
    if (currentInput === '0') currentInput = '';
    currentInput += button.textContent;
    updateDisplay(currentInput);
  });
});

operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (currentInput === '') return;
    if (previousValue !== null && operator !== null) {
      const result = operate(operator, previousValue, currentInput);
      updateDisplay(result);
      previousValue = result;
    } else {
      previousValue = currentInput;
    }
    operator = button.textContent;
    currentInput = '';
  });
});

equalButton.addEventListener('click', () => {
  if (operator === null || currentInput === '') return;
  const result = operate(operator, previousValue, currentInput);
  updateDisplay(result);
  previousValue = null;
  operator = null;
  currentInput = result.toString();
  shouldResetScreen = true;
});

clearButton.addEventListener('click', () => {
  currentInput = '';
  previousValue = null;
  operator = null;
  updateDisplay('0');
});

decimalButton.addEventListener('click', () => {
  if (shouldResetScreen) {
    currentInput = '';
    shouldResetScreen = false;
  }
  if (!currentInput.includes('.')) {
    currentInput += currentInput === '' ? '0.' : '.';
    updateDisplay(currentInput);
  }
});

backspaceButton.addEventListener('click', () => {
  if (shouldResetScreen) return;
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput || '0');
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Numbers
  if ('0123456789'.includes(key)) {
    if (shouldResetScreen) {
      currentInput = '';
      shouldResetScreen = false;
    }
    if (currentInput === '0') currentInput = '';
    currentInput += key;
    updateDisplay(currentInput);
  }

  // Operators
  if ('+-*/'.includes(key)) {
    if (currentInput === '') return;
    if (previousValue !== null && operator !== null) {
      const result = operate(operator, previousValue, currentInput);
      updateDisplay(result);
      previousValue = result;
    } else {
      previousValue = currentInput;
    }
    operator = key;
    currentInput = '';
  }

  // Equal
  if (key === 'Enter' || key === '=') {
    if (operator === null || currentInput === '') return;
    const result = operate(operator, previousValue, currentInput);
    updateDisplay(result);
    previousValue = null;
    operator = null;
    currentInput = result.toString();
    shouldResetScreen = true;
  }

  // Clear
  if (key === 'Backspace' || key === 'c' || key === 'C') {
    currentInput = '';
    previousValue = null;
    operator = null;
    updateDisplay('0');
  }

  // Decimal
  if (key === '.') {
    if (shouldResetScreen) {
      currentInput = '';
      shouldResetScreen = false;
    }
    if (!currentInput.includes('.')) {
      currentInput += currentInput === '' ? '0.' : '.';
      updateDisplay(currentInput);
    }
  }

  // Backspace (remove last character)
  if (key === 'Backspace') {
    if (shouldResetScreen) return;
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
  }
});
