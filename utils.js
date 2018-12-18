const lineLength = 45;

function timePrettifier(time) {
  var hours = Math.floor(time / 3600);
  var minutes = Math.floor(time % 3600 / 60);
  var seconds = time % 3600 % 60;
  seconds = truncate(seconds, 2);
  seconds = (seconds < 10) ? `0` + seconds : seconds;
  minutes = (minutes < 10) ? `0` + minutes : minutes;
  return timeReturn(seconds, minutes, hours);
}
//Final formatting pass to decide whether to include hours & minutes or append `s` to seconds
function timeReturn(seconds, minutes, hours) {
  return ((hours == 0 ? `` : `${hours}:`) +
    (minutes == 0 && hours == 0 ? `` : `${minutes}:`) +
    (minutes == 0 && hours == 0 ? `${seconds}s` : `${seconds}`));
}

function truncate(t, d) {
  return Math.trunc(t * Math.pow(10, d)) / Math.pow(10, d);
}

function addWhitespace(currentLength) {  
  if (currentLength == lineLength){
    return ``;
  }
  //Divide because of weird whitespace char
  var lengthLeft = Math.round((lineLength % currentLength)/3);
  console.log(`${lengthLeft} = ${lineLength} - (${currentLength} % ${lineLength})`);
  // ` ‏‏‎` << Weird fake whitespace char
  var spaces = new Array(lengthLeft + 1).join(` ‏‏‎`);
  console.log(spaces.length);
  console.log(`Returning: '${spaces}'`);
  return spaces;
}
//Determines the order of parameters, whether it starts with a map name or placement number
//1 is place
//0 is map
//This is done to use the return value for an array
function determineParameters(p1, p2){
  if (!Number(p1) && Number(p2)){
    return 1;
  }
  else if (!Number(p2) && Number(p1)){
    return 0;
  }
  else{
    return null;
  }
}

module.exports = {
  timePrettifier,
  addWhitespace,
  determineParameters
};