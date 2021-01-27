/**
 * Calculator with two modes: prefix or infix.
 * 
 * Default Mode: Prefix.
 * Valid Operands: '+', '-', '*', '/';
 */
export class Calculator {

    mode: string;
    operands: number[];
    operators: string[];
    validOperators: string[];

    constructor() {
        this.mode = 'prefix';
        this.operands = [];
        this.operators = [];
        this.validOperators = ['+', '-', '*', '/'];
    }

    /**
     * Sets the mode of the calculator.
     * @param newMode Either 'prefix' or 'infix'.
     */
    public setMode(newMode: string): void {
        this.mode = newMode;
        console.log('Calculator mode switched to ' + newMode.toString());
    }

    /**
     * Checks whether the given string is a valid operator.
     * @param currentElement string value to check.
     * @returns true if valid, false if not.
     */
    private elementIsValidOperator(currentElement: string): boolean {
        return this.validOperators.indexOf(currentElement) >= 0
    }

    /**
     * Check whether the string can be cast to a Number.
     * @param currentElement string value to check.
     * @returns true if string can be parsed to a number.
     */
    private elementIsValidNumber(currentElement: string): boolean {
        return !isNaN(Number(currentElement));
    }

    /**
     * Handle a string as either an operand or an operator and added to the class property as necessary.
     * @param currentElement string to be parsed as operator or operand.
     * @returns void
     */
    private handleElement(currentElement: string | undefined): void {

        if (currentElement === undefined ) {
            throw new Error("String contained undefined. Element " + currentElement);
        }

        if (this.elementIsValidOperator(currentElement)) {
            this.operators.push(currentElement)
        } else if (this.elementIsValidNumber(currentElement)) {
            this.operands.push(Number(currentElement))
        } else {
            throw new Error("String contained an element which was non-numeric and an illegal operator. Element " + currentElement);
        }
    }

    /**
     * Reset operators and operands for the class instance.
     * @returns void
     */
    private houseKeeping(): void {
        this.operators = [];
        this.operands = [];
    }

    /**
     * Wrapper method to redirect to the correct calculation method based on the current mode of the calculator.
     * @throws error if an invalid mode is being set.
     * @param input the input string to evaluate with the {@link calculator}.
     */
    public calculate(input: string): number {
        let inputSplit: string[] = input.split(' ');
        if (this.mode === 'prefix') {
            return this.calculatePrefix(inputSplit);
        } else if (this.mode === 'infix') {
            return this.calculateInfix(inputSplit);
        } else {
            throw new Error('Calculator is in an unexpected mode, please reset the calculator mode using the .setMode() method.');
        }
    }

    /**
     * Gets the two operands and the operator and returns the result given by {@link doCalculation}
     * @param flipInputs boolean input to reverse the order of the inputs to the atomic calculation.
     */
    private makeCalculation(flipInputs: boolean = false): number {
        let operandOne: number | undefined = this.operands.pop();
        let operandTwo: number | undefined = this.operands.pop();
        let operator: string | undefined = this.operators.pop();

        if ((operandOne === undefined) || (operandTwo === undefined) || (operator === undefined)) {
            throw new Error("Could not get operators and operand to perform atomic calculation. Operands: ${this.operands}; Operators: ${this.operators}.")
        }

        if (flipInputs) {
            return this.doCalculation(operator, operandTwo, operandOne);
        } else {
            return this.doCalculation(operator, operandOne, operandTwo);
        }
    }

    /**
     * Perform the atomic calculation.
     * @throws error if division by 0.
     * @param operator one of the valid operators for the calculator
     * @param operandOne one of the operands
     * @param operandTwo the other operand
     */
    private doCalculation(operator: string, operandOne: number, operandTwo: number): number {

        if (operator === '*') {
            return operandOne * operandTwo;
        } else if (operator === '/') {
            if (operandTwo === 0) {
                throw new Error("Illegal argument: Division by 0.");
            }
            return operandOne / operandTwo;
        } else if (operator === '+') {
            return operandOne + operandTwo;
        } else {
            return operandOne - operandTwo;
        }
        
    }

    /**
     * Prefix calculation
     * 
     * @throws error if input is of length 2
     * @throws error if input is of length 3 and the order of the elements is not operator, operand, operand.
     * @trows error if an element can not be parsed to a number or a valid operator.
     * @param input the input string to evaluate with the {@link calculator}.
     */
    private calculatePrefix(input: string[]): number {

        if (input.length === 1) { // if number return number otherwise will return NaN
            return Number(input[0])
        } else if (input.length === 2) { // if the length is 2 must be malformed
            throw new Error("Malformed input. Input " + input);
        } else if (input.length === 3) { // if the length is 3 just process off the bat - no need to get too complex
            let operator = input[0];
            let operandOne = input[1];
            let operandTwo = input[2];
            if ((this.elementIsValidOperator(operator)) && (!isNaN(Number(operandOne))) && (!isNaN(Number(operandTwo)))) {
                return this.doCalculation(input[0], Number(input[1]), Number(input[2]))
            } else {
                throw new Error("Malformed input. Input " + input);
            }
        } else { // More complex calculation

            let answer: number = 0;
            while (input.length > 0) {

                // if there are two operands and an operator, perform calculation and push the result to the front of the array.
                if ((this.operands.length >= 2) && (this.operators.length > 0)) {
                    const value: number = this.makeCalculation();
                    this.operands.unshift(value);
                } else { // else add the current element to the operands array or operator array as required.
                    const currentElement = input.pop();
                    this.handleElement(currentElement);
                }
            }

            // once at the tnd of the input, reverse the operands.
            this.operands = this.operands.reverse();

            // process the operands by popping operands and operators off the respective arrays and adding the result to the final answer.
            while ((this.operands.length >= 2) && (this.operators.length > 0)) {
                const value: number = this.makeCalculation();
                answer += value;
            }

            this.houseKeeping();
            return answer;
        }
    }

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
    private calculateInfix(input: string[]): number {

        let parenthesisCount: number = 0;

        while (input.length > 0) {
            let currentElement: string | undefined = input.shift();

            if (currentElement === '(') { // open parenthisis -> add to count.
                parenthesisCount += 1;
                continue;
            } else if (currentElement === ')') { // close parenthesis -> subtract from count, check validity, make atomic calculation.
                parenthesisCount -= 1;
                if (parenthesisCount < 0) {
                    throw new Error('Uneven number of parenthises in input string. Input: ' + input);
                }

                let value: number = this.makeCalculation(true);
                this.operands.push(value);

            //  else add the current element to the operands array or operator array as required.
            } else {
                this.handleElement(currentElement);
            }
        }

        if (parenthesisCount !== 0) {
            throw new Error('Uneven number of parenthises in input string. Input: ' + input);
        }

        const answer: number = this.operands[0];
        this.houseKeeping();
        return answer;
    }
}
