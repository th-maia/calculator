import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mathOperator: '',
      displayedNumber: '0',
      numberSaved: '',
    }
  }

  calculate = () => {
    const { mathOperator, displayedNumber, numberSaved} = this.state;
    let result
    
    const num1 = parseFloat(numberSaved);
    const num2 = parseFloat(displayedNumber);

    switch (mathOperator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num2 === 0 ? 'Erro' : num1 / num2;
        break;
      default:
        break;
    }
    
    //precisão é garantida até a 7 casa decimal.
    this.setState({
        mathOperator: '',
        displayedNumber: '',
        numberSaved: String(parseFloat(result.toFixed(7))),
    });
  }
  
  changeMathOperator = ({target}) => {
    if(this.checkNeedToCalculate()) {
      this.calculate()
      this.setState({mathOperator: target.value })

    } else if(this.checkToTurnNegative(target.value)) {  // 5 * - 5 = -25
      this.setState({displayedNumber: '-0' })

    } else {
      this.setState((state)=> { 
        return this.checkRemoveNegative()  // 5 * - + 5 = 10
          ? {displayedNumber: state.displayedNumber.slice(1), mathOperator: target.value} 
          : {mathOperator: target.value }
        },
        () => {
          if(this.state.numberSaved === '') {
            this.saveNumber();
          }
      });
    }
  }

  checkNeedToCalculate = () => {
    const {displayedNumber, numberSaved, mathOperator} = this.state
    return numberSaved && displayedNumber && displayedNumber !== '-0' && mathOperator;
  }

  checkToTurnNegative = (signal) => {
    const {displayedNumber, numberSaved, mathOperator} = this.state
    return signal === '-'
      && ((numberSaved === ''  && (displayedNumber === '0' || displayedNumber === ''))
        || (numberSaved !== '' && mathOperator !== ''))
  }

  checkRemoveNegative = () => {
    const {displayedNumber, mathOperator} = this.state
    return displayedNumber[0] === '-' && mathOperator;
  }

  saveNumber = () => {
    this.setState((state) => {return {numberSaved: state.displayedNumber, displayedNumber: ''}});
  }

  addNumberToDisplay = ({target}) => {
    //todo - bug- quando escrevemos um numero damos igual e digitamos outro sem botar o sinal. deveria dar clear.
    this.setState((prevState) => {
      const { displayedNumber } = prevState;
    
      // Se o displayedNumber for '0' ou '-0', substitui pelo target.value
      if (displayedNumber === '0' || displayedNumber === '-0') {
        return { displayedNumber: `${displayedNumber === '0' ? '' : '-'}${target.value}` };
      }
    
      // Para os demais casos, apenas concatena o valor ao número atual
      return { displayedNumber: displayedNumber + target.value };
    });
  }

  clear = () => {
    this.setState({
      mathOperator: '',
      displayedNumber: '0',
      numberSaved: '',
    })
  }

  addPoint = () => {
    if(!this.state.displayedNumber.includes('.')) {
      this.setState((state) => {
        return{
        displayedNumber: state.displayedNumber + '.',
      }})
    }
  }

  render() {
    return(
      <div id="calculator">
        <div id="display">{this.state.displayedNumber || this.state.numberSaved}</div>
        <div id="keypainel">
          <button id="clear" onClick={this.clear}>AC</button>

          <button id="divide" value="/" onClick={this.changeMathOperator}>/</button>
          <button id="multiply" value="*" onClick={this.changeMathOperator}>*</button>
          <button id="subtract" value="-" onClick={this.changeMathOperator}>-</button>

          <button id="seven" value="7" onClick={this.addNumberToDisplay}>7</button>
          <button id="eight" value="8" onClick={this.addNumberToDisplay}>8</button>
          <button id="nine" value="9" onClick={this.addNumberToDisplay}>9</button>

          <button id="add" value="+" onClick={this.changeMathOperator}>+</button>

          <button id="four" value="4" onClick={this.addNumberToDisplay}>4</button>
          <button id="five" value="5" onClick={this.addNumberToDisplay}>5</button>
          <button id="six" value="6" onClick={this.addNumberToDisplay}>6</button>

          <button id="one" value="1" onClick={this.addNumberToDisplay}>1</button>
          <button id="two" value="2" onClick={this.addNumberToDisplay}>2</button>
          <button id="three" value="3" onClick={this.addNumberToDisplay}>3</button>

          <button id="equals" onClick={this.calculate}>=</button>

          <button id="zero" value="0" onClick={this.addNumberToDisplay}>0</button>

          <button id="decimal" value="." onClick={this.addPoint}>.</button>
        </div>
      </div>
    )
  }
}

export default App;
