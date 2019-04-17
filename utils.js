const terms = require(`./constants`);
const lineLength = 45;

/**
 * Formats seconds into hours:minutes:seconds.
 * @param {string} time Seconds
 * @return {string}
 */
function timePrettifier(time) {
  const hours = Math.floor(time / 3600);
  let minutes = Math.floor(time % 3600 / 60);
  let seconds = time % 3600 % 60;
  seconds = truncate(seconds, 2);
  seconds = (seconds < 10) ? `0` + seconds : seconds;
  minutes = (minutes < 10) ? `0` + minutes : minutes;
  return timeReturn(seconds, minutes, hours);
}

/**
 * Final formatting pass to decide whether to include hours & minutes or append `s` to seconds.
 * @param {string} seconds
 * @param {string} minutes
 * @param {string} hours
 * @return {string}
 */
function timeReturn(seconds, minutes, hours) {
  return ((hours == 0 ? `` : `${hours}:`) +
    (minutes == 0 && hours == 0 ? `` : `${minutes}:`) +
    (minutes == 0 && hours == 0 ? (seconds < 10 ? `${seconds.substr(1)}s` : `${seconds}s`) : `${seconds}`));
}

/**
 * Truncate a number.
 * @param {float} t Number to truncate
 * @param {int} d Amount of decimals
 * @return {int}
 */
function truncate(t, d) {
  return Math.trunc(t * Math.pow(10, d)) / Math.pow(10, d);
}

/**
 * (Unused) Adds whitespace to string, to format chat responses.
 * @param {integer} currentLength Length of current line
 * @return {string} Return string of videos if any
 */
function addWhitespace(currentLength) {
  if (currentLength == lineLength) {
    return ``;
  }
  // Divide because of weird whitespace char
  const lengthLeft = Math.round((lineLength % currentLength)/3);
  console.log(`${lengthLeft} = ${lineLength} - (${currentLength} % ${lineLength})`);
  // ` ‏‏‎` << Weird fake whitespace char
  const spaces = new Array(lengthLeft + 1).join(` ‏‏‎`);
  console.log(spaces.length);
  console.log(`Returning: '${spaces}'`);
  return spaces;
}

/**
 * Ensure the number is positive, remove decimals and check type.
 * @param {integer} value
 * @return {integer} Positive number, or error if NaN
 */
function verifyNumber(value) {
  value = Number(value);
  return new Promise(function(resolve, reject) {
    if (value < 1 && value !== 0) {
      value = Math.round(value);
      value = value * -1;
    } else if (value === 0) {
      value = null;
    } else if (!Number(value)) {
      value = null;
    }
    if (value !== null) {
      resolve(value);
    } else {
      reject(value);
    }
  });
}

/**
 * Convert tf2 class into class symbol (S, D).
 * @param {string} s tf2 class
 * @return {string} S or D
 */
function classSymbol(s) {
  return s.charAt(0).toUpperCase();
}

/**
 * Reverse a string.
 * @param {string} s
 * @return {string}
 */
function stringReverse(s) {
  s = s.split(``);
  s.reverse();
  return s.join(``);
}

/**
 * Format points into format of (1 000 000).
 * @param {string} points
 * @return {string} Return string of formatted points (spaces between every 3 numbers)
 */
function formatPoints(points) {
  points = truncate(points, 0).toString();
  points = stringReverse(points);
  // Need to reverse because of dodgy regex
  points = points.replace(/(.{3})/g, '$1 ');
  if (points.charAt(points.length-1) === ` `) {
    points = points.slice(0, points.length-1);
  }
  return stringReverse(points);
}

/**
 * Determine which class a string is referring to.
 * @param {string} tf2Class
 * @return {string} Return standard string (`Soldier`, `Demoman`)
 */
function determineClass(tf2Class) {
  return new Promise((resolve, reject) => {
    if (terms.soldier.includes(tf2Class)) {
      resolve(`soldier`);
    } else if (terms.demo.includes(tf2Class)) {
      resolve(`demoman`);
    } else {
      reject(new Error(`Couldn't resolve class parameter.`));
    }
  });
}

/**
 * Return class symbol based on tf2 class numbers
 * @param {integer} number 3, 4
 * @return {string} Return tf2 class symbol (S, D)
 */
function numberToClassSymbol(number) {
  number = Number(number);
  if (number === 3) {
    return `S`;
  } else if (number === 4) {
    return `D`;
  } else {
    throw new Error(`Invalid class number, cannot convert: ${number}`);
  }
}

module.exports = {
  timePrettifier,
  addWhitespace,
  classSymbol,
  verifyNumber,
  formatPoints,
  determineClass,
  numberToClassSymbol,
};
