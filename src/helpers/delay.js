//setTimeOut ===> time in ms

function delay(time, val) {
  return new Promise( (resolve) => {
    setTimeout( () => {
      resolve(val);
    }, time)
  });
}

module.exports = delay
