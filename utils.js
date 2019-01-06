const lineLength = 45,
      bonusTypes = [`b`, `bonus`],
      courseTypes = [`c`, `course`],
      rankThresholds = [100, 50, 10, 5, 2, 3, 1];
      //completionThresholds = [20, 50, 70, 90];

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
    (minutes == 0 && hours == 0 ? (seconds < 10 ? `${seconds.substr(1)}s` : `${seconds}s`) : `${seconds}`));
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
async function determineParameters(p1, p2, p3 = null){
  return new Promise(async function (resolve, reject) {
      var results = []
    if (!Number(p1) && Number(p2)){
      //Order is map place      
      results.push(0);
    }
    else if (!Number(p2) && Number(p1)){
      //Order is place map
      results.push(1);
    }
    else{
      //Order contains either 2 numbers or no numbers - could be an issue for specific maps, adding map type prefix will fix as they will not be numbers
      reject(`Bad parameters.`);
    }
    if (p3 !== null && p3 !== `exact`){
      var type = await readParameterRunType(p3)
      .catch(e =>{
        reject(e);
      });
      results = results.concat(type);
      resolve(results);
    }
    else{
      results.push(`map`);
      results.push(1);
      resolve(results);
    }
  });
}
//Used to determine if the command included a 3rd parameter
//Should be in the format of `b` or `c` followed by a natural non-zero number
async function readParameterRunType(p){
  //Match numbers and remove them
  var type = p.replace(/[0-9]/g,'');
  //Match letters and remove them
  var number = p.replace(/[\D]/g,'');
  type = await determineRunType(type);
  number = await verifyNumber(number);
  if (type === undefined || number === undefined || type === null || number === null){
    return null;
  }
  else{
    return [type, number];
  }
}
//If the number is negative flip the sign
//If the number is 0 we don't want it
function verifyNumber(value){
  value = Number(value);
  return new Promise(function (resolve, reject){
    if (value < 1 && value !== 0){
      value = Math.round(value);
      value += value*2;
    }
    else if (value === 0){
      value = null;
    }
    else if (!Number(value)){
      value = null;
    }
    if (value !== null){
      resolve(value);
    }
    else{
      reject(value);
    }    
  })
}

function classSymbol(s){
  return s.charAt(0).toUpperCase();
}

function determineRunType(s){
  return new Promise(function (resolve, reject){
    if (bonusTypes.indexOf(s) > -1){
      resolve(`bonus`);
    }
    else if (courseTypes.indexOf(s) > -1){
      resolve(`course`);
    }
    else{
      reject(`null`);
    }
  })
}
//Function needs to dynamically generate sentences based on stats
async function evaluateStats(sRank, dRank, sPoints, dPoints, overallRank, tops, wrs, pr, totalZones){
  return new Promise(async function (resolve, reject){
    if (!Boolean(pr) || (sRank === 0 && dRank === 0)){
      reject(`doesn't appear to have any stats on Tempus.`);
    }
    else{
      var rankSentence = await generateRankSentence(sRank, dRank, overallRank, sPoints, dPoints);
      var completionSentence = await generateCompletionSentence(pr.map.count, tops, wrs, totalZones.map.count);
      console.log(`${rankSentence} ${completionSentence}`)
      resolve(`${rankSentence} ${completionSentence}`);
    }
  })
}

function formatPoints(points){  
  points = truncate(points, 0).toString();  
  points = points.replace(/(.{3})/g,"$1,");
  if (points.charAt(points.length-1) === `,`){
    points = points.slice(0, points.length-1);
  }
  return points;
}

function generateRankSentence(sRank, dRank, overallRank, sPoints, dPoints){
  var firstFragment = ``;
  sPoints = formatPoints(sPoints);
  dPoints = formatPoints(dPoints);
  console.log(sPoints, dPoints)
  if (sRank < dRank){
    firstFragment = rankThresholdCheck(sRank, `Soldier`, sPoints);
  }
  else if (dRank < sRank){
    firstFragment = rankThresholdCheck(dRank, `Demoman`, dPoints);
  }
  else if (sRank === dRank){
    firstFragment = rankThresholdCheck(sRank, `Both`, sPoints, dPoints);
  }
  if (overallRank <= rankThresholds[0]){
    var secondFragment = `is rank ${overallRank} overall`;
  }
  return `${firstFragment} ` + (Boolean(secondFragment) ? `and ${secondFragment}.` : `.`);
}

function rankThresholdCheck(number, tf2Class = `Soldier`, sPoints = 0, dPoints= 0){
  var pointFragment = (sPoints !== 0 ? (dPoints !== 0 ? `with ${sPoints} & ${dPoints} respectively` : `with ${sPoints} points`) : `with ${dPoints} points`);
  //Above rank 100
  if (number >= rankThresholds[0]){
    return `is rank ` + (tf2Class === `Both` ? `for both classes`: `${number} as ${tf2Class}`) + ` ${pointFragment}.`;
  }
  //Below rank 100 and above 50
  else if (number <= rankThresholds[0] > rankThresholds[1]){
    return `holds a respectable rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}`) + ` ${pointFragment}`;
  }
  //Below rank 50 and above 10
  else if (number <= rankThresholds[1] > rankThresholds[2]){
    return `tops out at an impressive rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}`) + ` ${pointFragment}`;
  }
  //Below rank 10 and above 5
  else if (number <= rankThresholds[2] > rankThresholds[3]){
    return `is one of the best at rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}`) + ` ${pointFragment}`;
  }
  //Below rank 5 and above 3
  else if (number <= rankThresholds[3] > rankThresholds[4]){
    return `is unmatched at rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}` ) + ` ${pointFragment}`;
  }
  //Rank 3
  else if (number === rankThresholds[4]){
    return `is the 3rd highest ranked player ` + (tf2Class === `Both` ? `for both classes`: `as ${tf2Class}`) + ` ${pointFragment}`;
  }
  //Rank 2
  else if (number === rankThresholds[5]){
    return `is the 2nd highest ranked player ` + (tf2Class === `Both` ? `for both classes`: `as ${tf2Class}`) + ` ${pointFragment}`;
  }
  //Rank 1
  else if (number === rankThresholds[6]){
    return `is the highest ranked player ` + (tf2Class === `Both` ? `for both classes`: `as ${tf2Class}`) + ` ${pointFragment}`;
  }
}

function generateCompletionSentence(pr, tt, wr, totalZones){
  return new Promise(function (resolve, reject){
    var firstFragment = completionThresholdCheck(pr, totalZones),
        secondFragment = generateTTSentence(tt, wr);
        resolve(`${firstFragment}` + secondFragment === `` ? `.` : ` ${secondFragment}`);
  });
}
//[20, 50, 70, 90]
function completionThresholdCheck(count, total){
  console.log(`Were checkin completion`)
  var percentage = truncate((count / (total * 2)) * 100, 2);
  return `have completed ${percentage}% [${count}] of maps`;
}

function generateTTSentence(tt, wr){
  var ttFragment = ``,
      wrFragment = ``,
      ttBool = Boolean(tt),
      wrbBool = Boolean(wr.bonus),
      wrcBool = Boolean(wr.course),
      wrBool = Boolean(wr.map);

  console.log(ttBool, wrbBool, wrcBool, wrBool);

  if (!ttBool || tt.map === undefined){
    ttFragment = ``;
  }
  else if (tt.map.count > 0 && tt.map.count <= 10){
    ttFragment = `have ${tt.map.count} map TT` + tt.map.count === 1 ? ``: `s`;
  }
  else if (tt.map.count > 10 && tt.map.count <= 50){
    ttFragment = `have a hefty ${tt.map.count} map TTs`;
  }
  else if (tt.map.count > 50 && tt.map.count <= 100){
    ttFragment = `have a beefy ${tt.map.count} map TTs`;
  }
  else if (tt.map.count > 100 && tt.map.count <= 250){
    ttFragment = `have a staggering ${tt.map.count} map TTs`;
  }
  else if (tt.map.count > 200){
    ttFragment = `have a monumental ${tt.map.count} map TTs`;
  }

  if (!wrBool && !wrcBool && !wrbBool){
    wrFragment = ``;
  }
  else{
    ttFragment = `along with ` + (wrBool ? `${wr.map.count} map` : ``) +
    (wrcBool && wrbBool ? `, ` : (wrcBool || wrbBool ? ` & `: ``)) + 
    (wrcBool ? `${wr.course.count} course` : ``) + 
    (wrbBool ? ` & ` : ``) +  
    (wrbBool ? `${wr.bonus.count} bonus` : ``) + 
    `WR` + wrBool ? (wr.map.count > 1 ? `s` : 
           (wrcBool ? (wr.course.count > 1 ? `s` : 
           (wrbBool ? (wr.bonus.count > 1 ? `s` : ``) : ``)): ``)) : ``
    + `.`;
  }
  return `${ttFragment}${wrFragment}`;
}

module.exports = {
  timePrettifier,
  addWhitespace,
  determineParameters,
  classSymbol,
  evaluateStats
};
