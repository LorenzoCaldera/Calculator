import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import './index.css'
const INVALID_EXPRESSION = "Invalid Expression";

const Screen = (props) => {
  return (
    <div>
      <div
        id="display">
        {props.answer !== ""
            ? props.answer
            : props.equation !== ""
            ? props.equation
            : "0"}
      </div>
      {props.error === INVALID_EXPRESSION && (
        <div className="calculator-error">{props.error}</div>
      )}
    </div>
  );
};

const Body = (props) => {
  const buttons = [7, 8, 9, 4, 5, 6, 1, 2, 3, ".", 0, "="];
  const ids = {
    7: "seven",
    8: "eight",
    9: "nine",
    4: "four",
    5: "five",
    6: "six",
    1: "one",
    2: "two",
    3: "three",
    ".": "decimal",
    0: "zero",
    "=": "equals",
    C: "clear",
    DEL: "delete",
    "/": "divide",
    "*": "multiply",
    "-": "subtract",
    "+": "add"
  };
  const operators = ["DEL", "C", "/", "*", "-", "+"];

  return (
    <div className="calculator-body">
      <div className="calculator-side-menu">
        {buttons.map((value) => (
          <button
            type="button"
            id={ids[value]}
            key={value}
            onClick={() => props.click(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="calculator-main">
        {operators.map((value) => (
          <button
            type="button"
            id={ids[value]}
            key={value}
            onClick={() => props.click(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

const CalculatorReducer = (state, value) => {
  let equationArray = state.equation.split("");
  let lastItem = equationArray[equationArray.length - 1];

  // The value is a number, return the number
  if (!isNaN(value)) {
    const newEquation = /^0+$/g.test(state.equation + value)
      ? "0"
      : state.equation + value;

    return {
      ...state,
      equation: newEquation,
      answer: "",
      value
    };
  }

  // Dot operator if is first to be selected
  if (isNaN(value) && state.equation.length < 1 && value === ".") {
    return {
      ...state,
      equation: "0.",
      value
    };
  }

  // Dot operator is selected
  if (state.equation.length >= 1 && value === ".") {
    // If the last operator selected is the dot operator - do nothing
    if (lastItem === ".") {
      return {
        ...state
      };
    }

    let newEquation = state.equation + value;
    let result = newEquation.replace(/(?<=\.+\w*)\./g, "");
    return {
      ...state,
      equation: result,
      value
    };
  }

  // Clear "C" operator is selected
  if (value === "C") {
    return {
      ...state,
      equation: "",
      error: "",
      answer: "",
      value
    };
  }

  // DEL operator is selected
  if (value === "DEL" && state.equation.length >= 1) {
    return {
      ...state,
      equation: state.equation.slice(0, -1),
      value
    };
  }

  // Math operator is selected
  if (["+", "/", "-", "*"].indexOf(value) !== -1) {
    if (state.equation.length >= 1) {
      let regex = /[\+\*\/-]-(?=[\+\*\/-])|[\+\*\/-](?=[\+\*\/])/g;
      let newEquation = state.equation + value;
      let filteredEquation = newEquation.replace(regex, "");

      return {
        ...state,
        equation: filteredEquation,
        value
      };
    }

    if (state.answer !== "") {
      return {
        ...state,
        equation: state.answer.toString() + value,
        answer: "",
        value
      };
    }
  }

  // Equal operator is selected
  if (value === "=" && state.equation.length >= 1) {
    let answer = "";
    let error = "";
    try {
      // eslint-disable-next-line
      answer = eval(state.equation);
    } catch (err) {
      error = INVALID_EXPRESSION;
    }

    return {
      ...state,
      equation: "",
      answer,
      error
    };
  }

  return {
    ...state,
    value
  };
};

class Calculator extends React.Component {
  state = {
    equation: "",
    value: 0,
    answer: "",
    error: ""
  };

  componentDidMount() {
    document.addEventListener("keyup", (event) => {
      let value =
        event.key.toUpperCase() === "BACKSPACE"
          ? "DEL"
          : event.key.toUpperCase() === "ENTER"
          ? "="
          : event.key.toUpperCase();
      const operators = [
        ".",
        "=",
        "C",
        "DEL",
        "+",
        "-",
        "*",
        "/",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0"
      ];
      
      if (operators.indexOf(value) !== -1) {
        this.setState(() => {
          return CalculatorReducer(this.state, value);
        });
      }
    });
  }

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(value) {
    this.setState(() => {
      return CalculatorReducer(this.state, value);
    });
  }

  render() {
    return (
      <div className="calculator">
        <Screen
          answer={this.state.answer}
          equation={this.state.equation}
          error={this.state.error}
        />
        <Body click={this.handleClick} />
      </div>
    );
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Calculator />
  </StrictMode>,
)
