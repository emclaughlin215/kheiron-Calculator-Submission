# Calculator

## Instructions

</br>

### Set up

From `/` run:
```bash
npm install
```
</br>
</br>

### Running Tests
From anywhere in the repository run:
```bash
npx jest
```
</br>
</br>

### Running it online
From the `/online-calculator/` directory run:
```bash
npm run start
```
Go to `localhost:3000/`

</br>
</br>

## Solution

</br>

### Prefix
</br>

_Introduction_

Prefix notation is a mathematic notation where the operator precedes the two operands. e.g.

```
- / 10 + 1 1 * 1 2

- / 10 (+ 1 1) (* 1 2)

- (/ 10 (+ 1 1)) (* 1 2)

- (/ 10 2) (* 1 2)

- 5 2

3
```

</br>

_The process_

```js
input = '- / 10 + 1 1 * 1 2'  -> ['-', '/', '10', '+', '1', '1', '*','1', '2']
```

Start with two empty arrays, one for the operands one for the operator.

```js
operands = []; operators = []; answer = 0;
```

- Loop while the input array still has elements.

1. Check if there are two operands and one operator in the respective arrays.

    If yes, perform the operation and insert if to the start of the operand array.

2. Pop the element off the input string array and assign it to one of the two arrays appropriately.

- Once the input array is empty, process the rest of the operands and operators remaining in the arrays.

1. Reverse the operand array to process in the correct order

2. Process the operations adding the result to the final answer on each occasion.

- Return `answer`.

</br>

_Example_
```js
input = '- / 10 + 1 1 * 1 2'  -> ['-', '/', '10', '+', '1', '1', '*','1', '2']

operands = []; operators = []; answer = 0;
```

Loop #1
```js
operands = [2]; operators = []; answer = 0;
```
Loop #2
```js
operands = [2, 1]; operators = []; answer = 0;
```
Loop #3
```js
operands = [2, 1]; operators = ['*']; answer = 0;
```
Loop #4 (2 * 1 = 2)
```js
operands = [2]; operators = []; answer = 0;
```
Loop #5
```js
operands = [2, 1]; operators = []; answer = 0;
```
Loop #6
```js
operands = [2, 1, 1]; operators = []; answer = 0;
```
Loop #7
```js
operands = [2, 1, 1]; operators = ['+']; answer = 0;
```
Loop #8 (1 + 1 = 2)
```js
operands = [2, 2]; operators = []; answer = 0;
```
Loop #9
```js
operands = [2, 2, 10]; operators = []; answer = 0;
```
Loop #10
```js
operands = [2, 2, 10]; operators = ['/']; answer = 0;
```
Loop #11 (10 / 2 = 5)
```js
operands = [5, 2]; operators = []; answer = 0;
```
Loop #12
```js
operands = [5, 2]; operators = ['-']; answer = 0;
```

Reached end of the input array.

Reverse operands array.
```js
operands = [2, 5]; operators = ['-']; answer = 0;
```

Perform operations and add to the answer until no more are to be made.
```js
operands = []; operators = []; answer = 3;

return answer // 3
```

</br>
</br>

### Infix

</br>
</br>

_Introduction_



</br>

_The process_



</br>


_Example_