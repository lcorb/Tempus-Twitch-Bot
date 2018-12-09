const lineLength = 44;

function timePrettifier(time) {
  var hours = Math.floor(time / 3600);
  var minutes = Math.floor(time % 3600 / 60);
  var seconds = time % 3600 % 60;
  seconds = truncate(seconds, 2);
  seconds = (seconds < 10) ? `0` + seconds : seconds;
  minutes = (minutes < 10) ? `0` + minutes : minutes;
  return timeReturn(seconds, minutes, hours);
}

function timeReturn(seconds, minutes, hours) {
  return ((hours == 0 ? `` : `${hours}:`) +
    (minutes == 0 && hours == 0 ? `` : `${minutes}:`) +
    (minutes == 0 && hours == 0 ? `${seconds}s` : `${seconds}`));
}

function truncate(t, d) {
  return Math.trunc(t * Math.pow(10, d)) / Math.pow(10, d);
}

function addWhitespace(currentLength) {
  var lengthLeft = lineLength - (currentLength % lineLength);
  // ` ‏‏‎ ` << Weird fake whitespace char
  var spaces = new Array(lengthLeft + 1).join(` ‏‏‎ `);
  console.log(`Returning: ${spaces}`);
  return spaces;
}

module.exports = {
  timePrettifier,
  addWhitespace
};