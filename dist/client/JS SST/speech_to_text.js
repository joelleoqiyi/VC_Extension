"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

window.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('start-button');
  var result = document.getElementById('result');
  var main = document.getElementsByTagName("main")[0];
  var listening = false;
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (typeof SpeechRecognition !== "undefined") {
    var recognition = new SpeechRecognition();

    var stop = function stop() {
      main.classList.remove("speaking");
      recognition.stop();
      button.textContent = "Start listening";
    };

    var start = function start() {
      main.classList.add("speaking");
      recognition.start();
      button.textContent = "Stop listening";
    };

    var onResult = function onResult(event) {
      result.innerHTML = "";

      var _iterator = _createForOfIteratorHelper(event.results),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var res = _step.value;
          var text = document.createTextNode(res[0].transcript);
          var p = document.createElement("p");

          if (res.isFinal) {
            p.classList.add("final");
          }

          p.appendChild(text);
          result.appendChild(p);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.addEventListener("result", onResult);
    button.addEventListener("click", function (event) {
      listening ? stop() : start();
      listening = !listening;
    });
  } else {
    button.remove();
    var message = document.getElementById("message");
    message.removeAttribute("hidden");
    message.setAttribute("aria-hidden", "false");
  }
});