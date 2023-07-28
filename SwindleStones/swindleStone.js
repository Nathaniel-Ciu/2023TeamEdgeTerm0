// valid Guesses for 5 dices
const validGuess = [ // This is me trying to make it not a mess | Future me, I'm sorry I didn't do this better
`one 1`, `one 2`, `one 3`, `one 4`, `one 5`, `one 6`, 

`two 1's`, `two 2's`, `two 3's`, `two 4's`, `two 5's`, `two 6's`,

`three 1's`, `three 2's`, `three 3's`, `three 4's`, `three 5's`, `three 6's` ,

`four 1's`, `four 2's`, `four 3's`, `four 4's`, `four 5's`, `four 6's`,

`five 1's`, `five 2's`, `five 3's`, `five 4's`, `five 5's`, `five 6's`,

// --------------------------------------------------------
// Everything below this line is unlikely because players would have called before this point 

`six 1's`, `six 2's`, `six 3's`, `six 4's`, `six 5's`, `six 6's`,

`seven 1's`, `seven 2's`, `seven 3's`, `seven 4's`, `seven 5's`, `seven 6's`,

`eight 1's`, `eight 2's`, `eight 3's`, `eight 4's`, `eight 5's`, `eight 6's`,

`nine 1's`, `nine 2's`, `nine 3's`, `nine 4's`, `nine 5's`, `nine 6's`,

`ten 1's`, `ten 2's`, `ten 3's`, `ten 4's`, `ten 5's`, `ten 6's`
]
// Note: Higher index beats lower index (check rules for SwindleStone / Liar's Dice) 

const READLINE = require("readline-sync");


// player variables 
let playerDiceCount = 5; // subj to change
let playerRoll = [];
let playerResponse;

// bot variables 
let botDiceCount = 5; // subj to change
let botRoll = [];
let ones = 0;
let twos = 0;
let threes = 0;
let fours = 0;
let fives = 0;
let sixes = 0;
let playerMoves = [];
let counter = 0; // don't remember why we need this | but if used this will have to reset during the match 

// for bot to understand player's claim
let amountOfNum; // the number of occurances of a certain number 
let num; // the specific value for which the other player claims "at least k occurrences" on the table.
let probability = 0; // to see if player's claim is probable (look at calculateProbablity)

// Game Vars
let tutorial = false;
let movesCalled = [];
let totalDiceInPlay = playerDiceCount + botDiceCount; // will need to be updated as game progresses





function bot(dumHumanPlay) { // bot doesn't check player claim history
    counter = 0;
    totalDiceInPlay = playerDiceCount + botDiceCount; // updating variable in use 
    amountOfNum = botTranslatorPart1();
    num = botTranslatorPart2();
    console.log(`\nBot thinking...`);
    if (amountOfNum > totalDiceInPlay) {
        // bot will call (because player claim is bs)
        console.log(`Bot calls because that claim is total bs`);
    } else {
        console.log(`\nPlayer claim not bs`);
        botCheckBotRoll(); // update bot's known rolled values 
        if (botRollMatchPlayerInput()) {  // if player is right 
            // bot will respond with it's own claim (never call)
            console.log(`Bot responds with own claim because it has claimed values`);
        } else { // if there's a chance the player is false, calcuate chance its true and respond in accordance
            calculateProbablity();
            console.log(`\nProbabilty player is right is ${probability}\n`);
            if (Math.random() > probability) {
                console.log(`Bot calls because it's improbable`);
                // return `call`;
                // bot calls
            } else {
                // bot responds with its own claim 
                console.log(`Bot responds with own claim because it's probable`);
            }
        }
    }

}

function botClaims() {
    
}

function calculateProbablity() {
    probability = 0; // to reset past calculations 
    // we have already check if bot roll has sastified player claim

    playerNeeds = amountOfNum; // player claim Ex. three 1's
    if (num == 1) {
        playerNeeds -= ones; // the amount player needs to have if bot has 1's
    } else if (num == 2) {
        playerNeeds -= twos; 
    } else if (num == 3) {
        playerNeeds -= threes; 
    } else if (num == 4) {
        playerNeeds -= fours; 
    } else if (num == 5) {
        playerNeeds -= fives; 
    } else if (num == 6) {
        playerNeeds -= sixes; 
    } else {
        throw new Error(`How did we get that?`);
    }
    
    console.log(`\nplayerNeed before after considering bot hand: ${playerNeeds}`);

    if (playerNeeds == 1) { // player needs to roll one of that value to sastify claim
        probability += 1 - (5/6) ** playerDiceCount;
    } else { //if (playerNeeds > 1 && playerNeeds < 7)
        console.log(`bot is caculating probabilty`);
        /*
        The for loop comes from the equation 

        let k = instances
        let i = counter variable
        let n = # of independent trial
        let p = probabilty of desired 
        let q = probabilty of undesired 
                               
                                        n
        P(at least k successes) = (Summuation Sign) nCr * p^r * q^(n-r)
                                    i = k 
        */

        for (let index = playerNeeds;index <=  playerDiceCount; index++) {
            probability += combination(playerDiceCount, index) * ((1/6) ** index) * ((5/6) ** (playerDiceCount - index));
        }
    }

    // } else {
    //     probability = 0;
    // }
    
    /* Scrapped 
    Here is the calucation generated by ChatGPT 3.5 (had to regenerate this multiple times don't expect this to be perfect)

    Let 'n' be the total number of dice in play.
    Let 'm' be the number of dice you possess and know their values.
    Let 'x' be the specific value for which the other player claims "at least k occurrences" on the table.
    Let 's' be the number of sides on each die (e.g., 6 for a standard six-sided die).
    Let 'k' be the number of occurances of a certain number 

    The probability 'P' that the other player's claim is correct, taking into account that you know your dice's values, is given by the formula:

    P = Σ [C(n-m, k-m) * (1/s)^(k-m) * (1 - 1/s)^(n-m-k) * (mCk) * (1/s)^m]


    // for (let occurrences = botDiceCount; occurrences < totalDiceInPlay; occurrences++) {
    //     probability += combination(totalDiceInPlay - botDiceCount, amountOfNum - botDiceCount) * ((1/6)**(totalDiceInPlay - botDiceCount)) * ((1 - (1/6)) ** (totalDiceInPlay - botDiceCount - occurrences)) * combination(botDiceCount, occurrences) * ((1/6) ** botDiceCount);
    // }
    // probability = probability * 1000; 
    // another 0 for Math.random(), (Math.random() doesn't usually generate really smol #)
    // but this is countered by the fact that it should call if the probabily is really low 
    */
}

// factorialize() from https://www.freecodecamp.org/news/how-to-factorialize-a-number-in-javascript-9263c89a4b38/
function factorialize(num) {
    if (num < 0) {
        return -1;
    } else if (num == 0) {
        return 1;
    } else {
        return (num * factorialize(num - 1));
    }
}

function combination(value1, value2) {
    return factorialize(value1) / (factorialize(value1 - value2) * factorialize(value2));
}

function botRollMatchPlayerInput() {
    for (let offset = 0; offset < botDiceCount; offset++) { // check if bot has player input 
        if (botRoll[offset] == num) {
            counter++ 
        }
    }
    // if (counter >= amountOfNum) {
    //     return true; // don't ever call 
    // } 
    return counter >= amountOfNum; // 
}


function botCheckBotRoll() { // i think this works didn't check tho
    for (let offset = 0; offset < botDiceCount; offset++) {
        if (botRoll[offset] == 1) {
            ones++;
        } else if (botRoll[offset] == 2) {
            twos++;
        } else if (botRoll[offset] == 3) {
            threes++;
        } else if (botRoll[offset] == 4) {
            fours++;
        } else if (botRoll[offset] == 5) {
            fives++;
        } else if (botRoll[offset] == 6) {
            sixes++;
        } else {
            throw new Error(`How did we roll that?`);
        }
    }
}

//see if need
function botTranslatorPart1() { // assumes playerResponse is valid (so check playerResponse before calling this)
    if (playerResponse.includes(`one`)) {
        return 1; 
    } else if (playerResponse.includes(`two`)) {
        return 2;
    } else if (playerResponse.includes(`three`)) {
        return 3;
    } else if (playerResponse.includes(`four`)) {
        return 4;
    } else if (playerResponse.includes(`five`)) {
        return 5;
    } else if (playerResponse.includes(`six`)) {
        return 6;
    } else if (playerResponse.includes(`seven`)) {
        return 7;
    } else if (playerResponse.includes(`eight`)) {
        return 8;
    } else if (playerResponse.includes(`nine`)) {
        return 9;
    } else if (playerResponse.includes(`ten`)) { 
        return 10;
    } else  {
        throw new Error(`Player input seems to be invalid?`);
    }

}

function botTranslatorPart2() {
    if (playerResponse.includes(`1`)) {
        return 1; 
    } else if (playerResponse.includes(`2`)) {
        return 2;
    } else if (playerResponse.includes(`3`)) {
        return 3;
    } else if (playerResponse.includes(`4`)) {
        return 4;
    } else if (playerResponse.includes(`5`)) {
        return 5;
    } else if (playerResponse.includes(`6`)) {
        return 6;
    } else {
        throw new Error(`Player input seems to be invalid?`);
    }
}

function printArray(array) {
    let tempString = ``;
    for (let offset = 0; offset < array.length; offset++) {
        if (offset == array.length - 1) {
            tempString += `${array[offset]}`;
        } else {
            tempString += `${array[offset]}, `;
        }
    }
    return tempString;
}

function rollDice() {
    let tempVar;
    for (let offset = 0; offset < playerDiceCount; offset++) {
        tempVar = Math.round((Math.random() * 5) + 1);
        playerRoll.push(tempVar);

    }

    for (let offset = 0; offset < botDiceCount; offset++) {
        tempVar = Math.round((Math.random() * 5) + 1);
        botRoll.push(tempVar);
    }
}


function printOpponentRoll() {
    let tempString = ``;
    for (let offset = 0; offset < botDiceCount; offset++) {
        if (offset == botDiceCount - 1) {
            tempString += `?`;
        } else {
            tempString += `?, `;
        }
    }
    return `Your opponent's roll: \n${tempString} \n`;
}

function playerMove() {
    playerResponse = READLINE.question(`Your turn\n`);
    playerResponse = playerResponse.toLowerCase();
}

function checkValidMove(move) {
    try {
        if (move != `call`) {
            if (validGuess.includes(move)) {
                if (movesCalled.length == 0) { // if first move then 
                    // console.log(`\nThis is the first move and gets a pass`);
                    movesCalled.push(move);
                    
                } else { // if not first move 
                    // Checking the index of the last element in movesCalled      against index of recently played move
                    if (validGuess.indexOf(movesCalled[movesCalled.length - 1]) < validGuess.indexOf(move)) { // if valid move
                        movesCalled.push(move);
                        
                    } else { // move is not valid 
                        throw new Error(`Move is not valid`);
                    }
                }
            } else { //move is not valid 
                throw new Error(`Move is not valid`);
            }
        }
    } catch {
        console.log(`\nThat move is invalid or cannot be played. Please input the amount of times and then the #. \nEx. one 1 or three 4's \nInput "Valid Moves" for a list of moves you can perform \n`);
        playerMove();
        checkValidMove(playerResponse);
    }
}

function gameSim() {

    rollDice(); 
    while (playerDiceCount > 0 && botDiceCount > 0) {
        // Rolling  | NOTE SHOULD ONLY ROLL ONCE PER ROUND
        // rollDice(); 
        // console.log(printOpponentRoll());
        console.log(`\nBot's Roll`)
        console.log(`${printArray(botRoll)}`);
        console.log(`Your Roll`);
        console.log(`${printArray(playerRoll)}\n`);

        // Player's Turn
        playerMove();
        checkValidMove(playerResponse);
        playerMoves.push(playerResponse); // for bot (maybe?)
        // console.log(`So your move is \n${playerResponse}*`); checking if readline records spaces after input (it doesn't)
        
        // Bot's Turn
        bot(playerResponse);


    }
    

}

function main() {
    // rollDice();
    // console.log(`Bot Roll is : `);
    // console.log(printArray(botRoll));
    // console.log();
    // console.log(`Player Roll is:`);
    // console.log(printArray(playerRoll));
    // console.log(Math.random() * 1);
    gameSim();
    // console.log((1/6) ** botDiceCount);
    // console.log(`player move is : ${playerResponse}`);
}

main();
