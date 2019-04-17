const utils = require(`../../../utils`);

const bonusTypes = [`b`, `bonus`];
const courseTypes = [`c`, `course`];

/**
 * Determines the order of parameters, whether it starts with a map name or placement number
 * @param {string} p1 First parameter
 * @param {string} p2 Second parameter
 * @param {string} p3 Third parameter (optional)
 * @param {string} tf2Class Check if tf2Class is included as the 3rd parameter (optional)
 * @return {array} [(1 or 0), (`map`, `course`, `bonus`), zone index]
 * 1 is place
 * 0 is map
 */
async function determineParameters(p1, p2, p3 = null, tf2Class = null) {
  return new Promise(async function(resolve, reject) {
    let results = [];
    if (!Number(p1) && Number(p2)) {
      // Order is map place
      results.push(0);
    } else if (!Number(p2) && Number(p1)) {
      // Order is place map
      results.push(1);
    } else {
      // Order contains either 2 numbers or no numbers - could be an issue for some maps, adding map type prefix will fix as they will not be numbers
      reject(new Error(`Bad parameters.`));
    }
    if (p3 !== null && p3 !== `exact` && tf2Class !== null && (tf2Class !== `soldier` || tf2Class !== `demoman`)) {
      const type = await readParameterRunType(p3)
          .catch((e) =>{
            reject(e);
          });
      results = results.concat(type);
      resolve(results);
    } else {
      results.push(`map`);
      results.push(1);
      resolve(results);
    }
  });
}

/**
 * Used to determine if the command included a 3rd parameter, and then parse the parameter
 * Should be in the format of `b` or `c` followed by a natural non-zero number
 * @access private
 * @param {string} p Parameter
 * @return {void}
 */
async function readParameterRunType(p) {
  // Match numbers and remove them
  let type = p.replace(/[0-9]/g, '');
  // Match letters and remove them
  let number = p.replace(/[\D]/g, '');
  type = await determineRunType(type);
  number = await utils.verifyNumber(number);
  if (type === undefined || number === undefined || type instanceof Error || number instanceof Error) {
    return null;
  } else {
    return [type, number];
  }
}
/**
 * Used to determine what type of zone a parameter is.
 * @access private
 * @param {string} s String parsed from command.
 * @return {string} Resolves promise with bonus, course or error
 */
function determineRunType(s) {
  return new Promise(function(resolve, reject) {
    if (bonusTypes.indexOf(s) > -1) {
      resolve(`bonus`);
    } else if (courseTypes.indexOf(s) > -1) {
      resolve(`course`);
    } else {
      reject(new Error(`Unexpected run type: ${s}`));
    }
  });
}

module.exports = determineParameters;
