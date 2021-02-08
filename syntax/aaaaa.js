var args = process.argv;

let answer = args[2]

console.log("Plz Type 1 or 2");

console.log(answer);

if(answer === "1"){
    console.log("yeah! Number one!")
} else if (answer === "2"){
    console.log("well... i prefer one")
} else {
    console.log("You idiot. i said one or tow!")
}

