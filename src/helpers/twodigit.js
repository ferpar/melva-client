export default function twoDigits(number){
return (number < 10 && number >= 0) ? '0'+number : number.toString()
};

