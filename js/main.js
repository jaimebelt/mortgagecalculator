/**
 * Main class which manages all app operations
 */
'use strict';

class MortgageCalculatorApp {

  constructor() {
    // Shortcuts to DOMelements.
    this.amountTextInput = document.getElementById("amount");
    this.taxTextInput = document.getElementById("tax");
    this.insuranceTextInput = document.getElementById("insurance");
    this.yearsRange = document.getElementById("years");
    this.rateRange = document.getElementById("rate");
    this.yearsValSpan = document.getElementById("yearsVal");
    this.rateValSpan = document.getElementById("rateVal");
    this.resultBoxDiv = document.getElementById("result-box");
    this.btnCalculate = document.getElementById("calculate");


     //update slider view (fix progress bar color)
    this.listenSlider(this.yearsRange,0);
    this.listenSlider(this.rateRange,1);

    // add event Listeners.
    this.amountTextInput.addEventListener('keyup', (event)=>{
      this.listenOnTextField(this.amountTextInput);
    });
    this.taxTextInput.addEventListener('keyup', (event)=>{
      this.listenOnTextField(this.taxTextInput);
    });
    this.insuranceTextInput.addEventListener('keyup', (event)=>{
      this.listenOnTextField(this.insuranceTextInput);
    });

    this.yearsRange.addEventListener('input', (event)=>{
      this.listenSlider(this.yearsRange,0);
    });
    this.rateRange.addEventListener('input', (event)=>{
      this.listenSlider(this.rateRange,1);
    });

    this.btnCalculate.addEventListener('click', ()=>{
      this.calculate(this.btnCalculate);
    });
  }

  /**
   * Replace non numeric characters and adds error class if there is no data on the field
   * @param   {DOMelement}                 element
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T10:51:52-0500
   */
  listenOnTextField(element){
    const re = /[^0-9\.]/;
    let newstr = element.value.replace(re, "");
    element.value=newstr;
    if(newstr==""){
      element.closest(".input-wrapper").classList.add('val-error');
    }else{
      element.closest(".input-wrapper").classList.remove('val-error');
    }
  }

  /**
   * Adds functionality to range elements to set progress track bar color and update value showed to user
   * @param   {DOMelement}            element
   * @param   {number}                 decimals decimal numbers of showed value
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T11:54:44-0500
   */
  listenSlider(element,decimals){
    element.style.background= 'linear-gradient(to right, #1091cc 0%, #1091cc '+element.value +'%, #cacaca ' + element.value + '%, #cacaca 100%)';
    let val=this.getRangeValue(element);
    let spanVal=element.closest(".range-selector").querySelector(".view-value");
    spanVal.innerHTML=this.formatNumber(val,decimals,true,"");
  }

  /**
   * Returns range value, given the limits in metatag "true-range" of the range input.
   * @param   {DOMelement}                 element
   * @return  {float}                       current value of the DOMelement
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T11:58:46-0500
   */
  getRangeValue(element){
    let value=0;
    if(element.getAttribute("true-range")=="true"){
      value=parseFloat($("#"+sliderId).val());
    }else{
      let range=element.getAttribute("true-range");
      let rangesplit=range.split(",");
      let min=parseFloat(rangesplit[0]);
      let max=parseFloat(rangesplit[1]);
      value=(parseFloat(element.value)/100)*(max-min)+min;
    }
    return value;
  }

  /**
   * Formats a number to a string representation based on the current locale of the user
   * @param   {number}                 number   number to be formated
   * @param   {number}                 decimals number of decimals of the output number
   * @param   {boolean}                round    whether to round the given number
   * @param   {string}                 prefix   add prefix to output number
   * @return  {string}                          formated number
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T12:02:30-0500
   */
  formatNumber(number,decimals,round,prefix){
    let num=number;
    let numStr=""+parseInt(number);
    if(round){
      num = Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
    }
    return prefix+num.toLocaleString(this,{minimumSignificantDigits:numStr.length+decimals});
  }

  /**
   * Get values from DOMelements, calculates totals and update corresponding DOMelements. 
   * Also updates DOM to show error where data is not complete
   * @param   {DOMelement}                 element DOMelement which executes action
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T12:01:02-0500
   */
  calculate(element){
    let interestRate=parseFloat(this.rateValSpan.innerHTML);

    let yearsOfMortgage=parseFloat(this.yearsValSpan.innerHTML);
    if(this.amountTextInput.value!="" && this.taxTextInput.value!="" && this.insuranceTextInput.value!=""){
      let loanAmount=parseFloat(this.amountTextInput.value);
      let annualTax=parseFloat(this.taxTextInput.value);
      let annualInsurance=parseFloat(this.insuranceTextInput.value);

      let principle=((interestRate / 100) / 12)* loanAmount / (1-Math.pow((1 + ((interestRate / 100)/12)),-yearsOfMortgage*12));
      let tax=annualTax/12;
      let insurance=annualInsurance / 12;
      let monthlyPayment=principle + tax + insurance;

      this.updateResultValue('principleResult',this.formatNumber(principle,2,true,"$ "));
      this.updateResultValue('taxResult',this.formatNumber(tax,2,true,"$ "));
      this.updateResultValue('insuranceResult',this.formatNumber(insurance,2,true,"$ "));
      this.updateResultValue('totalResult',this.formatNumber(monthlyPayment,2,true,"$ "));

      element.innerHTML="RECALCULATE";
      
      if(!this.resultBoxDiv.classList.contains('visible') && this.isMobile()){
        this.animateScroll(365,300);
        this.resultBoxDiv.classList.add('visible');
      }
    }else {
      this.listenOnTextField(this.amountTextInput);
      this.listenOnTextField(this.taxTextInput);
      this.listenOnTextField(this.insuranceTextInput);
    }
  }

  /**
   * Update the DOMelement with the given data. 
   * @param   {String}                 fieldId DOMelement id
   * @param   {String}                 value   value to show
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T12:01:24-0500
   */
  updateResultValue(fieldId,value){
    let element=document.getElementById(fieldId);
    if(!element.classList.contains('non-empty-value')){
      element.classList.add('non-empty-value');
    }
    element.innerHTML=value;
  }

  /**
   * Animates scroll movement on Y axis
   * @param   {number}                 scrollY number of pixel to scroll from crrent point
   * @param   {number}                 ms      duration of animation in ms
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T12:08:04-0500
   */
  animateScroll(scrollY,ms) {
    const maxcount=100; 
    let count=0;
    let scrollBy=scrollY/maxcount;
    let id = setInterval(frame, ms/maxcount);
    function frame() {
      if (count == maxcount) {
        clearInterval(id);
      } else {
        window.scrollBy(0, scrollBy);
        count++;
      }
    }
  }

  /**
   * Evaluates if current view is mobile
   * @return  {Boolean}                true if view is mobile, false otherwise
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T12:09:17-0500
   */
  isMobile() {
    if(window.innerWidth <= 768) {
      return true;
    } else {
      return false;
    }
  }
}

// On load start the app.
window.addEventListener('load', function() {
  new MortgageCalculatorApp();
});