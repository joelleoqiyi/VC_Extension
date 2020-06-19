"use strict";

window.addEventListener('DOMContentLoaded', function () {
  var result = document.getElementById('result');
  var form = document.getElementById('voice-form');
  var speak = document.getElementById('speak-button');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var toSay = result.innerHTML.trim();
      var utterance = new SpeechSynthesisUtterance(toSay);
      speechSynthesis.speak(utterance);
      result.value = '';
    });
  }
});