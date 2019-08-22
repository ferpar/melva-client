export default function capitalize(str) {
    let returnStr = str;
    try {
      returnStr = str.split(' ').filter(word => word!=="").map( word => {
        word = word.toLowerCase();
        word = word[0].toUpperCase() + word.slice(1)
        return word
      }).join(' ')
    }
    catch (e) {
      console.error('Error executing string capitalize helper', err)  
    }
    finally {
      return returnStr
    }
  }
