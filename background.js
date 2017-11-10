// Variables
let interval;
let seconds = 0;

// Import requires scripts to background
importScript("lib/moment-with-locale.min.js");
importScript("lib/jquery.min.js");
importScript("js/utils.js");
importScript("js/storage.js");
importScript("js/task.js");

// Listen to messaging API
chrome.runtime.onMessage.addListener(function(msg) {
  switch (msg.type) {
    case "START":
      start();
      break;
    case "UPDATE":
      sendSeconds();
      break;
    case "STOP":
    default:
      stop();
      break;
  }
});

// Send seconds signal and data to popup.js
function sendSeconds() {
  chrome.runtime.sendMessage({
    type: "UPDATE",
    seconds
  });
}

// Start the timer
function start() {
  interval = setInterval(() => {
    seconds++;
    sendSeconds();
  }, 1000);
}

// Stop the timer
function stop() {
  clearInterval(interval);
  seconds = 0;
}

// Import script from source
function importScript(src) {
  const elem = document.createElement("script");
  elem.src = chrome.extension.getURL(src);
  document.body.appendChild(elem);
}
