import { Calculator } from '../calculator';

describe('Calculator Prefix Tests', () => {

    let calc = new Calculator();

    test('test solution 1', () => {
        expect(calc.calculate('+ 1 * 2 3')).toBe(7)});

    test('test solution 2', () => {
        expect(calc.calculate('+ 3 2')).toBe(5)});

    test('test solution 3', () => {
        expect(calc.calculate('/ 3 2')).toBe(1.5)});

    test('test solution 4', () => {
        expect(calc.calculate('- / 10 + 1 1 * 1 2')).toBe(3)});

    test('test solution 5', () => {
        expect(calc.calculate('+ / 3 2 5')).toBe(6.5)});
    
    test('test solution 6', () => {
        expect(calc.calculate('5')).toBe(5)});

    test('test solution 7', () => {
        expect(calc.calculate('*')).toBe(NaN)});
})

describe('Calculator Infix Tests', () => {

    let calc = new Calculator();
    calc.setMode('infix');

    test('test solution 1', () => {
        expect(calc.calculate('( 2 + 3 )')).toBe(5)});

    test('test solution 2', () => {
        expect(calc.calculate('( 1 + ( 2 * 3 ) )')).toBe(7)});

    test('test solution 3', () => {
        expect(calc.calculate('( ( 1 * 2 ) + 3 )')).toBe(5)});

    test('test solution 4', () => {
        expect(calc.calculate('( ( ( 1 + 1 ) / 10 ) - ( 1 * 2 ) )')).toBe(-1.8)});

    test('Test Parenthises 1', () => {
        expect(() => calc.calculate('((')).toThrowError();
    })

    test('Test Parenthises 2', () => {
        expect(() => calc.calculate('()))(')).toThrowError();
    })
})
