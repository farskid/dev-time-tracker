const utils = (function() {
  function secondsToHoursAndMinutes(seconds) {
    const hours = Math.floor(seconds / 3600);
    const divisorForMinutess = seconds % 3600;
    const minutes = Math.floor(divisorForMinutess / 60);
    const divisorForSeconds = divisorForMinutess % 60;
    const secs = Math.ceil(divisorForSeconds);

    return {
      hours,
      minutes,
      seconds: secs
    };
  }
  function formatTime(secs) {
    const { hours, minutes, seconds } = secondsToHoursAndMinutes(secs);
    return [hours, minutes, seconds].map(num => addLeadingZero(num)).join(":");
  }
  function addLeadingZero(num) {
    return num < 10 ? `0${num}` : String(num);
  }

  function today() {
    const date = new moment();
    return date.format("ddd, MMM Do, YYYY");
  }

  return {
    secondsToHoursAndMinutes,
    formatTime,
    addLeadingZero,
    today
  };
})();
