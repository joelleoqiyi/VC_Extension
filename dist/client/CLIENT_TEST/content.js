"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//the javascript code in this page is injected into the current page that the person is using... seems interesting
//this file will be used if we want to interact with any tabs or webpages which the user has open alr. i guess one idea is interacting with like google hangout? not really sure if we want to do that
var capturedValues = "";
var prevUpdate = "";

function readCaptions() {
  if (String(document.getElementsByClassName("a4cQT")[0].attributes[0].value) === "LM3KPc") {
    var wrapperAncestorClass = document.getElementsByClassName("a4cQT")[0];
    var wrapperParentClass;

    if (wrapperAncestorClass.children) {
      wrapperParentClass = wrapperAncestorClass.children;
    } else {
      return;
    }

    var _iterator = _createForOfIteratorHelper(wrapperParentClass),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        wrapperClass = _step.value;

        if (wrapperClass.getAttribute("class") === "TBMuR") {
          if (wrapperClass.children) {
            if (wrapperClass.children[1].getAttribute("class") === "zs7s8d" && wrapperClass.children[1].innerHTML === "You") {
              if (wrapperClass.children[2].getAttribute("class") === "Mz6pEf") {
                if (wrapperClass.children[2].children[0].getAttribute("class") === "iTTPOb") {
                  var transcriptMessages = wrapperClass.children[2].children[0].children;

                  for (var currMessageCount = transcriptMessages.length - 1; currMessageCount >= 0; currMessageCount--) {
                    var transcriptMessage = String(transcriptMessages[currMessageCount].children[0].innerText);

                    if (transcriptMessage !== prevUpdate) {
                      var repeatedMessage = transcriptMessage.search(prevUpdate);

                      if (prevUpdate === "") {
                        capturedValues = capturedValues.concat(String(transcriptMessage) + " ");
                      } else if (repeatedMessage !== -1) {
                        capturedValues = capturedValues.concat(String(transcriptMessage).substr(repeatedMessage + prevUpdate.length + 1) + " ");
                      } else {
                        capturedValues = capturedValues.concat(String(transcriptMessage) + " ");
                      }

                      prevUpdate = String(transcriptMessage);
                      return true;
                    } else {
                      return false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

var targetNode = document.getElementsByClassName("a4cQT")[0];
var config = {
  attributes: true,
  childList: true,
  subtree: true
};

var callback = function callback(mutationsList, observer) {
  var _iterator2 = _createForOfIteratorHelper(mutationsList),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var mutation = _step2.value;

      if (mutation.type === 'childList') {
        readCaptions();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}; // Create an observer instance linked to the callback function


var observer = new MutationObserver(callback); // Start observing the target node for configured mutations and send it back to background.js every 10 seconds.

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "start") {
    observer.observe(targetNode, config);
    setInterval(function () {
      chrome.runtime.sendMessage({
        "newTranscript": capturedValues
      });
    }, 10000);
  }
});