# arithmetic-expression-evaluator
My take on an arithmetic expression evaluator. As its name implies, it implements a `solve` function that takes an arithmetic expression encoded in a string and solves it.

## TLDR;

```ts
import { solve } from './index';
// expression can cantain variables
const expr = "1/(10- 5)*50 - $MyVar";

//variable values are passed in the context argument
const results = solve(expr, { $MyVar: 4});
//returns  6
```

## Install
install modules

```sh
yarn
```

## Build
generates transpiled es5 js files

```sh
yarn build
```

## Test
runs unit tests

```sh
yarn test
```

## Operators
There are three types of operators:
1. Infix Operators
These are operators that take both a left and right operand (e.g. 1 + 1)
2. Prefix Operators
These are operators that take only a right operand (e.g. -10)
3. Suffix Operators
These are operators that take only a left operand (e.g $VAR++)

| Infix Operators      | Prefix Operators | Suffix Operators |
| ----------- | -------- | ----------- |
| +      | - | ++ |
| -   | ! | -- |
| /      | ++ |
| *   | -- |
| <      |
| <=   |
| >      |
| >=   |
| &&  |
| \|\|   |
| ==   |
| ^   |

## Variables
Your expressions can contain variables. Variables have to be named with a trailing `$`. For example `$MyVar`.


## Implementation details
The implementation consists of 4 main functions that are called sequentially:

1. [Tokenize](./src/utils/tokenize.ts)
takes the expression string and extracts the tokens

2. [Preprocess](./src/utils/tokenize.ts)
reformats the tokens array into a recursive form I arbitrarily call chunks

3. [Parse](./src/utils/parse.ts)
takes the chunks array and generates a tree structure that can be recursively evaluated

4. [Evaluate](./src/utils/evaluate.ts)
takes the parse tree generated in the previous step and calculates the final value.

## Customizing the expression syntax:
* Some aspects of the expression syntax can be customized by changing the values of the variables defined in the [config](./src/config.ts) file.
* Things that can be changed are for example the symbols used for the operators, or their precedence.
* You can also add new or remove operators.
