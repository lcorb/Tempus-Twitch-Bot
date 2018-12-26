const lineLength = 45;
const expectedRunTypes = {
  bonus: [`b`, `bonus`],
  course: [`c`, `course`]
}

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
//This is done to use the return value for an array index
async function determineParameters(p1, p2, p3 = null, p4 = null){  
  if (p3 !== null){
    var numbers = await readParameterRunType(p3, p4);
  }
  return new Promise(function (resolve, reject) {
    if (!Number(p1) && Number(p2)){
      //Order is map place      
      resolve(0);
    }
    else if (!Number(p2) && Number(p1)){
      //Order is place map
      resolve(1);
    }
    else{
      //Order contains either 2 numbers or no numbers - could be an issue for specific maps, adding map type prefix will fix as they aren't numbers
      reject(null);
    }
  });
}
//Used to determine if the command included a 3rd parameter (or 4th by mistake)
//Should be in the format of `b` or `c` followed by a natural non-zero number
async function readParameterRunType(p1, p2 = null){
  if (p2 === null){
    //Match numbers and remove them
    var type = p1.replace(/[0-9]/g,'');
    //Match letters and remove them
    var number = p1.replace(/[\D]/g,'');
    type = await determineRunType(type);
    number = await verifyNumbers(number);
    if (type === undefined || number === undefined || type === null || number === null){
      return null;
    }
    else{
      return {type: type, number: number};
    }
  }
  else{
    if (!Number(p2)){
      return null;
    }
    else{
      return {p1, p2}
    }
  }
}
//If the number is negative flip the sign
//If the number is 0 we don't want it
function veryifyNumbers(){
  var numbers = arguments;
  return new Promise(function (resolve, reject){
    numbers.forEach(value =>{
      if (value < 1 && value !== 0){
        value = Math.round(value);
        this.value += value*2;
      }
      else if (value === 0){
        this.value = null;
      }
      else if (!Number(value)){
        this.value = null;
      }
    }, this);
    console.log(`Here be my numbers: `+ numbers);
    resolve(numbers);
  })
}

function classSymbol(s){
  return s.charAt(0).toUpperCase();
}

function determineRunType(s){
  return new Promise(function (resolve, reject){
    if (s in expectedRunTypes.bonus){
      resolve(`bonus`);
    }
    else if (s in expectedRunTypes.course){
      resolve(`course`);
    }
    else{
      reject(`null`);
    }
  })
}

function formatRunType(zone, index){
  
}

module.exports = {
  timePrettifier,
  addWhitespace,
  determineParameters,
  classSymbol
};