/**
 * @module Calc
 * @description Módulo que implementa uma calculadora com operações básicas
 * @author Maciel Alves
 * @version 1.0.0
 * @since 2024-01-01
 * @license MIT
 * @example
 * const calc = new Calc();
 * calc.init();
 */
export class Calc {
    constructor() {
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    /**
     * @description Create the calculator
     * @returns {HTMLDivElement}
     */
    createCalculator() {
        const calculator = document.createElement('div');
        calculator.className = 'calculator';

        calculator.innerHTML = `
      <div class="calc-display">
        <input type="text" id="display" readonly>
      </div>
      <div class="calc-buttons" id="buttons">
        <button class="calc-btn clear">C</button>
        <button class="calc-btn operator">±</button>
        <button class="calc-btn operator">%</button>
        <button class="calc-btn operator">÷</button>
        
        <button class="calc-btn number">7</button>
        <button class="calc-btn number">8</button>
        <button class="calc-btn number">9</button>
        <button class="calc-btn operator">×</button>
        
        <button class="calc-btn number">4</button>
        <button class="calc-btn number">5</button>
        <button class="calc-btn number">6</button>
        <button class="calc-btn operator">-</button>
        
        <button class="calc-btn number">1</button>
        <button class="calc-btn number">2</button>
        <button class="calc-btn number">3</button>
        <button class="calc-btn operator">+</button>
        
        <button class="calc-btn number zero">0</button>
        <button class="calc-btn number">.</button>
        <button class="calc-btn equals">=</button>
      </div>
    `;

        this.display = calculator.querySelector('#display');
        this.buttons = calculator.querySelector('#buttons');
        this.init();

        return calculator;
    }

    /**
     * @description Initialize the calculator
     */
    init() {
        this.buttons.addEventListener('click', this.handleButtonClick.bind(this));
        this.display.value = '0';
    }

    /**
     * @description Handle button click
     * @param {Event} event
     */
    handleButtonClick(event) {
        const button = event.target;
        if (!button.matches('button')) return;

        const value = button.textContent;

        if (button.classList.contains('number')) {
            this.handleNumber(value);
        } else if (button.classList.contains('operator')) {
            this.handleOperator(value);
        } else if (button.classList.contains('equals')) {
            this.calculate();
        } else if (button.classList.contains('clear')) {
            this.clear();
        }
    }

    /**
     * @description Handle number button click
     * @param {string} value
     */
    handleNumber(value) {
        if (this.shouldResetDisplay) {
            this.display.value = '';
            this.shouldResetDisplay = false;
        }
        
        if (value === '.' && this.display.value.includes('.')) return;
        if (value === '0' && this.display.value === '0') return;

        if (this.display.value === '0' && value !== '.') {
            this.display.value = value;
        } else {
            this.display.value += value;
        }
    }

    /**
     * @description Handle operator button click
     * @param {string} operator
     */
    handleOperator(operator) {
        if (operator === '±') {
            this.display.value = (-parseFloat(this.display.value)).toString();
            return;
        }

        if (operator === '%') {
            this.display.value = (parseFloat(this.display.value) / 100).toString();
            return;
        }

        if (this.operation && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.display.value;
        this.operation = operator;
        this.shouldResetDisplay = true;
    }

    /**
     * @description Calculate the result of the operation
     */
    calculate() {
        if (!this.operation || !this.previousValue) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.display.value);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.display.value = 'Erro';
                    return;
                }
                result = prev / current;
                break;
        }

        this.display.value = this.formatResult(result);
        this.operation = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
    }

    /**
     * @description Format the result of the operation
     * @param {number} number
     * @returns {string}
     */
    formatResult(number) {
        const stringNumber = number.toString();
        if (stringNumber.length > 12) {
            return number.toExponential(7);
        }
        return stringNumber;
    }

    /**
     * @description Clear the display
     */
    clear() {
        this.display.value = '0';
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }
}

