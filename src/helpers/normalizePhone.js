export default function normalizePhone(str) {
  let returnStr = str;
  try {
    str.length === 9 ?  returnStr = "+34" + str : (str.length === 11 ? returnStr = "+" + str : returnStr = str.toString() )
  }
  catch (e) {
    console.error('Error executing normalizePhone helper', err)
  } finally {
    return returnStr
  }
}
