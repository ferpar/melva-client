export default function capitalize(str) {
    let returnStr = str;
    try {
      returnStr = str.split(' ').filter(word => word!=="").map( word => word.toLowerCase().replace(word[0], word[0].toUpperCase())).join(' ')
    }
    catch (e) {
      console.error('Error executing string capitalize hepler', err)  
    }
    finally {
      return returnStr
    }
  }
