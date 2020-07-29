const tempress = 604389237

const temp = tempress & 0xFFFFF;
const pressfrac = tempress >> 20;

console.log(pressfrac);
console.log(temp);
