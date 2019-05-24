# Mortgage Calculator

This app calculates mortgage monthly payment based on given data. 

![alt text](image.png?raw=true "sample image")

## Prerequisites

- To open the app is not necessary any external library o compiler.
- npm (to install and run Babel)
- Sass (to make changes to scss source)
- Babel (to keep compatibility with ES5 if "js/main.js" is modify)

## Usage:

Just open "index.html" in your browser

### To change styles or js:

Compile scss by the following command
```
sass scss/main.scss css/main.css
```
Compile ES6 js by the following command
```
npm run babel
```

## Formulas

### Principle & Interest:
*((interestRate / 100) / 12) \* loanAmount / (1-Math.pow((1 + ((interestRate / 100)/12)),-yearsOfMortgage\*12))*

### Tax:
*annualTax / 12*

### Insurance:
*annualInsurance / 12*

### Monthly payment:
*principleAndInterests + Tax + Insurance*