/**
 * 
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MortgageCalculatorApp = function () {
  function MortgageCalculatorApp() {
    var _this = this;

    _classCallCheck(this, MortgageCalculatorApp);

    // Shortcuts to DOM Elements.
    this.amountTextInput = document.getElementById("amount");
    this.taxTextInput = document.getElementById("tax");
    this.insuranceTextInput = document.getElementById("insurance");
    this.yearsRange = document.getElementById("years");
    this.rateRange = document.getElementById("rate");
    this.yearsValSpan = document.getElementById("yearsVal");
    this.rateValSpan = document.getElementById("rateVal");
    this.resultBoxDiv = document.getElementById("result-box");
    this.btnCalculate = document.getElementById("calculate");

    // add event Listeners.
    this.amountTextInput.addEventListener('keyup', this.listenOnTextField.bind(this.amountTextInput));
    this.taxTextInput.addEventListener('keyup', this.listenOnTextField.bind(this.taxTextInput));
    this.insuranceTextInput.addEventListener('keyup', this.listenOnTextField.bind(this.insuranceTextInput));

    this.yearsRange.addEventListener('input', function (event) {
      _this.listenSlider(_this.yearsRange, 0);
    });
    this.rateRange.addEventListener('input', function (event) {
      _this.listenSlider(_this.rateRange, 1);
    });

    this.btnCalculate.addEventListener('click', function () {
      _this.calculate(_this.btnCalculate);
    });
  }

  /**
   * Replace non numeric characters and adds error class if there is no data on the field
   * @param   {[type]}                 element [description]
   * @return  {[type]}                         [description]
   * @author Jaime Beltran
   * @version 1.0
   * @date    2019-05-24T10:51:52-0500
   */


  _createClass(MortgageCalculatorApp, [{
    key: "listenOnTextField",
    value: function listenOnTextField(element) {
      var re = /[^0-9\.]/;
      var newstr = this.value.replace(re, "");
      this.value = newstr;
      if (newstr == "") {
        this.closest(".input-wrapper").classList.add('val-error');
      } else {
        this.closest(".input-wrapper").classList.remove('val-error');
      }
    }
  }, {
    key: "listenSlider",
    value: function listenSlider(element, decimals) {
      element.style.background = 'linear-gradient(to right, #1091cc 0%, #1091cc ' + element.value + '%, #cacaca ' + element.value + '%, #cacaca 100%)';
      var val = this.getSliderValue(element);
      var spanVal = element.closest(".range-selector").querySelector(".view-value");
      spanVal.innerHTML = this.formatNumber(val, decimals, true, "");
    }
  }, {
    key: "getSliderValue",
    value: function getSliderValue(element) {
      var value = 0;
      if (element.getAttribute("true-range") == "true") {
        value = parseFloat($("#" + sliderId).val());
      } else {
        var range = element.getAttribute("true-range");
        var rangesplit = range.split(",");
        var min = parseFloat(rangesplit[0]);
        var max = parseFloat(rangesplit[1]);
        value = parseFloat(element.value) / 100 * (max - min) + min;
      }
      return value;
    }
  }, {
    key: "formatNumber",
    value: function formatNumber(number, decimals, round, prefix) {
      var num = number;
      var numStr = "" + parseInt(number);
      if (round) {
        num = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
      }
      return prefix + num.toLocaleString(this, { minimumSignificantDigits: numStr.length + decimals });
    }
  }, {
    key: "calculate",
    value: function calculate(element) {
      var interestRate = parseFloat(this.rateValSpan.innerHTML);

      var yearsOfMortgage = parseFloat(this.yearsValSpan.innerHTML);
      if (this.amountTextInput.value != "" && this.annualTax.value != "" && this.annualInsurance.value != "") {
        var loanAmount = parseFloat(this.amountTextInput.value);
        var annualTax = parseFloat(this.taxTextInput.value);
        var annualInsurance = parseFloat(this.insuranceTextInput.value);

        var principle = interestRate / 100 / 12 * loanAmount / (1 - Math.pow(1 + interestRate / 100 / 12, -yearsOfMortgage * 12));
        var tax = annualTax / 12;
        var insurance = annualInsurance / 12;
        var monthlyPayment = principle + tax + insurance;

        this.updateResultValue('principleResult', this.formatNumber(principle, 2, true, "$ "));
        this.updateResultValue('taxResult', this.formatNumber(tax, 2, true, "$ "));
        this.updateResultValue('insuranceResult', this.formatNumber(insurance, 2, true, "$ "));
        this.updateResultValue('totalResult', this.formatNumber(monthlyPayment, 2, true, "$ "));

        element.innerHTML = "RECALCULATE";

        if (!this.resultBoxDiv.classList.contains('visible') && this.isMobile()) {
          this.animateScroll(180, 300);
          this.resultBoxDiv.classList.add('visible');
        }
      } else {
        alert("There are some missing fields");
      }
    }
  }, {
    key: "updateResultValue",
    value: function updateResultValue(fieldId, value) {
      var element = document.getElementById(fieldId);
      if (!element.classList.contains('non-empty-value')) {
        element.classList.add('non-empty-value');
      }
      element.innerHTML = value;
    }
  }, {
    key: "animateScroll",
    value: function animateScroll(scrollY, ms) {
      var elem = document.getElementById("result-box");
      var count = 0;
      var maxcount = 100;
      var scrollBy = scrollY / maxcount;
      var id = setInterval(frame, ms / maxcount);
      function frame() {
        if (count == maxcount) {
          clearInterval(id);
        } else {
          window.scrollBy(0, scrollBy);
          count++;
        }
      }
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      if (window.innerWidth <= 768) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return MortgageCalculatorApp;
}();

// On load start the app.


window.addEventListener('load', function () {
  new MortgageCalculatorApp();
});
