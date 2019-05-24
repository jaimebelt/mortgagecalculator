# Mortgage Calculator

This app calculates monthly payment based on given data. 

![alt text](https://github.com/jaimebelt/reviewtextcode.git/master/image.png)

## Formulas are:

### Principle & Interest:
*((interestRate / 100) / 12)* loanAmount / (1-Math.pow((1 + ((interestRate / 100)/12)),-yearsOfMortgage*12))*

### Tax
*annualTax / 12*

### Insurance
*annualInsurance / 12*

### Monthly payment
*principleAndInterests + Tax + Insurance*