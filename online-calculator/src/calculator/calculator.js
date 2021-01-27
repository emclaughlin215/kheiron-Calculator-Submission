"use strict";
exports.__esModule = true;
/**
 * Calculator with two modes: prefix or infix.
 *
 * Default Mode: Prefix.
 * Valid Operands: '+', '-', '*', '/';
 */
var Calculator = /** @class */ (function () {
    function Calculator() {
        this.mode = 'prefix';
        this.operands = [];
        this.operators = [];
        this.validOperators = ['+', '-', '*', '/'];
    }
    /**
     * Sets the mode of the calculator.
     * @param newMode Either 'prefix' or 'infix'.
     */
    Calculator.prototype.setMode = function (newMode) {
        this.mode = newMode;
        console.log('Calculator mode switched to ' + newMode.toString());
    };
    /**
     * Checks whether the given string is a valid operator.
     * @param currentElement string value to check.
     * @returns true if valid, false if not.
     */
    Calculator.prototype.elementIsValidOperator = function (currentElement) {
        return this.validOperators.indexOf(currentElement) >= 0;
    };
    /**
     * Check whether the string can be cast to a Number.
     * @param currentElement string value to check.
     * @returns true if string can be parsed to a number.
     */
    Calculator.prototype.elementIsValidNumber = function (currentElement) {
        return !isNaN(Number(currentElement));
    };
    /**
     * Handle a string as either an operand or an operator and added to the class property as necessary.
     * @param currentElement string to be parsed as operator or operand.
     * @returns void
     */
    Calculator.prototype.handleElement = function (currentElement) {
        if (currentElement === undefined) {
            throw new Error("String contained undefined. Element " + currentElement);
        }
        if (this.elementIsValidOperator(currentElement)) {
            this.operators.push(currentElement);
        }
        else if (this.elementIsValidNumber(currentElement)) {
            this.operands.push(Number(currentElement));
        }
        else {
            throw new Error("String contained an element which was non-numeric and an illegal operator. Element " + currentElement);
        }
    };
    /**
     * Reset operators and operands for the class instance.
     * @returns void
     */
    Calculator.prototype.houseKeeping = function () {
        this.operators = [];
        this.operands = [];
    };
    /**
     * Wrapper method to redirect to the correct calculation method based on the current mode of the calculator.
     * @throws error if an invalid mode is being set.
     * @param input the input string to evaluate with the {@link calculator}.
     */
    Calculator.prototype.calculate = function (input) {
        var inputSplit = input.split(' ');
        if (this.mode === 'prefix') {
            return this.calculatePrefix(inputSplit);
        }
        else if (this.mode === 'infix') {
            return this.calculateInfix(inputSplit);
        }
        else {
            throw new Error('Calculator is in an unexpected mode, please reset the calculator mode using the .setMode() method.');
        }
    };
    /**
     * Gets the two operands and the operator and returns the result given by {@link doCalculation}
     * @param flipInputs boolean input to reverse the order of the inputs to the atomic calculation.
     */
    Calculator.prototype.makeCalculation = function (flipInputs) {
        if (flipInputs === void 0) { flipInputs = false; }
        var operandOne = this.operands.pop();
        var operandTwo = this.operands.pop();
        var operator = this.operators.pop();
        if ((operandOne === undefined) || (operandTwo === undefined) || (operator === undefined)) {
            throw new Error("Could not get operators and operand to perform atomic calculation. Operands: ${this.operands}; Operators: ${this.operators}.");
        }
        if (flipInputs) {
            return this.doCalculation(operator, operandTwo, operandOne);
        }
        else {
            return this.doCalculation(operator, operandOne, operandTwo);
        }
    };
    /**
     * Perform the atomic calculation.
     * @throws error if division by 0.
     * @param operator one of the valid operators for the calculator
     * @param operandOne one of the operands
     * @param operandTwo the other operand
     */
    Calculator.prototype.doCalculation = function (operator, operandOne, operandTwo) {
        if (operator === '*') {
            return operandOne * operandTwo;
        }
        else if (operator === '/') {
            if (operandTwo === 0) {
                throw new Error("Illegal argument: Division by 0.");
            }
            return operandOne / operandTwo;
        }
        else if (operator === '+') {
            return operandOne + operandTwo;
        }
        else {
            return operandOne - operandTwo;
        }
    };
    /**
     * Prefix calculation
     *
     * @throws error if input is of length 2
     * @throws error if input is of length 3 and the order of the elements is not operator, operand, operand.
     * @trows error if an element can not be parsed to a number or a valid operator.
     * @param input the input string to evaluate with the {@link calculator}.
     */
    Calculator.prototype.calculatePrefix = function (input) {
        if (input.length === 1) { // if number return number otherwise will return NaN
            return Number(input[0]);
        }
        else if (input.length === 2) { // if the length is 2 must be malformed
            throw new Error("Malformed input. Input " + input);
        }
        else if (input.length === 3) { // if the length is 3 just process off the bat - no need to get too complex
            var operator = input[0];
            var operandOne = input[1];
            var operandTwo = input[2];
            if ((this.elementIsValidOperator(operator)) && (!isNaN(Number(operandOne))) && (!isNaN(Number(operandTwo)))) {
                return this.doCalculation(input[0], Number(input[1]), Number(input[2]));
            }
            else {
                throw new Error("Malformed input. Input " + input);
            }
        }
        else { // More complex calculation
            var answer = 0;
            while (input.length > 0) {
                // if there are two operands and an operator, perform calculation and push the result to the front of the array.
                if ((this.operands.length >= 2) && (this.operators.length > 0)) {
                    var value = this.makeCalculation();
                    this.operands.unshift(value);
                }
                else { // else add the current element to the operands array or operator array as required.
                    var currentElement = input.pop();
                    this.handleElement(currentElement);
                }
            }
            // once at the tnd of the input, reverse the operands.
            this.operands = this.operands.reverse();
            // process the operands by popping operands and operators off the respective arrays and adding the result to the final answer.
            while ((this.operands.length >= 2) && (this.operators.length > 0)) {
                var value = this.makeCalculation();
                answer += value;
            }
            this.houseKeeping();
            return answer;
        }
    };
    /**
     * Infix calculation.
     *
     * Parse the string from left to right.
     * Each time a parenthesis is closed, perform the atomic calculation on the most recent two operands seen using most recents operator seen.
     * Add the result to the end of the operand array.
     * Once you have reached the end of the input string, the remaining operand is the final answer.
     *
     * @throws error if there is a closed parenthises without a corresponding opening one.
     * @throws error if there are remaining opening parentheses at the end of the calculation.
     * @param input the input string to evaluate with the {@link calculator}.
     */
    Calculator.prototype.calculateInfix = function (input) {
        var parenthesisCount = 0;
        while (input.length > 0) {
            var currentElement = input.shift();
            if (currentElement === '(') { // open parenthisis -> add to count.
                parenthesisCount += 1;
                continue;
            }
            else if (currentElement === ')') { // close parenthesis -> subtract from count, check validity, make atomic calculation.
                parenthesisCount -= 1;
                if (parenthesisCount < 0) {
                    throw new Error('Uneven number of parenthises in input string. Input: ' + input);
                }
                var value = this.makeCalculation(true);
                this.operands.push(value);
                //  else add the current element to the operands array or operator array as required.
            }
            else {
                this.handleElement(currentElement);
            }
        }
        if (parenthesisCount !== 0) {
            throw new Error('Uneven number of parenthises in input string. Input: ' + input);
        }
        var answer = this.operands[0];
        this.houseKeeping();
        return answer;
    };
    return Calculator;
}());
exports.Calculator = Calculator;
