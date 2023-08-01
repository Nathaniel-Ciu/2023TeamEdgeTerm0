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

`ten 1's`, `ten 2's`, `ten 3's`, `ten 4's`, `ten 5's`, `ten 6's`,

`call`
]
// Note: Higher index beats lower index (check rules for SwindleStone / Liar's Dice) 

// const dicePics = [
//     ``, // so the indexes line up with the value of dice shown
//     `_____
//     |     |
//     |  •  |
//     |_____|`, // 1
//     `_____
//     |•    |
//     |     |
//     |____•|`, // 2
//     `_____
//     |•    |
//     |  •  |
//     |____•|`, // 3
//     `_____
//     |•  • |
//     |     |
//     |•__•_|`, // 4
//     `_____
//     |•   •|
//     |  •  |
//     |•___•|`, // 5
//     `_____
//     |•  • |
//     |•  • |
//     |•__• |`  // 6
// ]

const READLINE = require("readline-sync");




// player variables 
let playerDiceCount = 5; // subj to change
let playerRoll = [];
let playerResponse = ``; 

// bot variables 
let botDiceCount = 5; // subj to change
let botRoll = [];
let botOnes = 0;
let botTwos = 0;
let botThrees = 0;
let botFours = 0;
let botFives = 0;
let botSixes = 0;
// let playerMoves = [];
// let counter = 0; // don't remember why we need this | but if used this will have to reset during the match 

// For bot to make moves
let botAmountOfNum;
let botNum;

// for bot to understand player's claim
let amountOfNum; // the number of occurances of a certain number 
let num; // the specific value for which the other player claims "at least k occurrences" on the table.
let playerProbability = 0; // to see if player's claim is probable (look at calculatePlayerprobability)

// Game Vars
let tutorial = false;
let movesCalled = [];
let totalDiceInPlay = playerDiceCount + botDiceCount; // will need to be updated as game progresses
let gameState = `playing`;
let totalOnes = 0;
let totalTwos = 0;
let totalThrees = 0;
let totalFours = 0;
let totalFives = 0;
let totalSixes = 0;
let loser;




function bot(dumHumanPlay) { // bot doesn't check player claim history
    counter = 0;
    totalDiceInPlay = playerDiceCount + botDiceCount; // updating variable in use 
    if (playerResponse != ``) {
        amountOfNum = botTranslatePlayerPart1();
        num = botTranslatePlayerPart2();
    } else if (playerResponse == ``) {
        botClaim = validGuess[botClaims()]
        movesCalled.push(botClaim);
        return  `\nBot: ${botClaim}`;
    }
    if (movesCalled.length == 0) {
        botClaim = validGuess[botClaims()]
        movesCalled.push(botClaim);
        return  `\nBot: ${botClaim}`;
    } 
    if (amountOfNum > totalDiceInPlay) {
        // bot will call (because player claim is bs)
        return `call`;
    } else {
        // console.log(`\nPlayer claim not bs`);
        botCheckBotRoll(); // update bot's known rolled values 
        if (botRollMatchPlayerInput()) {  // if player is right 
            // Bot responds with own claim because it has claimed values
            botClaim = validGuess[botClaims()]
            movesCalled.push(botClaim);
            return  `\nBot: ${botClaim}`;
        } else { // if there's a chance the player is false, calcuate chance its true and respond in accordance
            calculatePlayerProbability();
            // console.log(`\nProbabilty player is right is ${playerProbability}\n`);
            if (Math.random() > playerProbability) {
                // Bot calls because it's improbable
                return `call`;
            } else {
                // bot responds with its own claim 
                botClaim = validGuess[botClaims()]
                movesCalled.push(botClaim);
                return  `\nBot: ${botClaim}`;
            }
        }
    }
    

}


// bot claims should be structured the same way as player claims 
function botClaims() { // returns bestMoveIndex (int)

    let bestMoveProb = -100000000000; 
    let bestMoveIndex;
    let lastMoveCalledIndex; // stores the index of the last element in movedCalled in validGuess (Confusing ik ik im sry)
    
    if (movesCalled.length != 0) { 
        lastMoveCalledIndex = validGuess.indexOf(movesCalled[movesCalled.length - 1]); // stores the index of the last element in movedCalled in validGuess (Confusing ik ik im sry)
    } else {
        lastMoveCalledIndex = -1;
    }
    lookInAdvance = Math.round(Math.random() * 10); // so bot isn't too predictable or hard to beat
    for (let index = lastMoveCalledIndex + 1; index < (lastMoveCalledIndex + lookInAdvance) && index < validGuess.length; index++) {
        
        challengingClaimProb = calcuateBotPossibleClaim(index);
        
        if (challengingClaimProb > bestMoveProb) {
            bestMoveIndex = index; 
            bestMoveProb = challengingClaimProb;
        }

    }
    

    if (isNaN(validGuess[bestMoveIndex])) { // temp fix 
        // console.log(`bestMoveIndex is ${bestMoveIndex}`);
        bestMoveIndex = lastMoveCalledIndex + 1;
    }

    botAmountOfNum =  botTranslatorValid1(validGuess[bestMoveIndex]);
    botNum = botTranslatorValid2(validGuess[bestMoveIndex]);
    
    return bestMoveIndex;
}


function calcuateBotPossibleClaim(offset) { // not accurate
    let botProbability = 0; // to reset past calculations 
    
    // recieve the next possible claim
    botAmountOfNum = botTranslatorValid1(validGuess[offset]);
    botNum = botTranslatorValid2(validGuess[offset]);


    botNeeds = botAmountOfNum; // player claim Ex. three 1's
    if (botNum == 1) {
        botNeeds -= botOnes; // the amount player needs to have if bot has 1's
    } else if (botNum == 2) {
        botNeeds -= botTwos; 
    } else if (botNum == 3) {
        botNeeds -= botThrees; 
    } else if (botNum == 4) {
        botNeeds -= botFours; 
    } else if (botNum == 5) {
        botNeeds -= botFives; 
    } else if (botNum == 6) {
        botNeeds -= botSixes; 
    } else {
        throw new Error(`How did we get that?`);
    }

    if (botNeeds == 1) { // bot needs player to roll one of that value to sastify claim
        botProbability += 1 - (5/6) ** playerDiceCount;
    } else { // formula explaination in calculatePlayerProbability()
        for (let counter = botNeeds; counter <=  playerDiceCount; counter++) {
            botProbability += combination(playerDiceCount, counter) * ((1/6) ** counter) * ((5/6) ** (playerDiceCount - counter));
        }
        
    }

    return botProbability;
    
}

function calculatePlayerProbability() { // not accurate 
    playerProbability = 0; // to reset past calculations 

    // we have already check if bot roll has sastified player claim

    playerNeeds = amountOfNum; // player claim Ex. three 1's
    if (num == 1) {
        playerNeeds -= botOnes; // the amount player needs to have if bot has 1's
    } else if (num == 2) {
        playerNeeds -= botTwos; 
    } else if (num == 3) {
        playerNeeds -= botThrees; 
    } else if (num == 4) {
        playerNeeds -= botFours; 
    } else if (num == 5) {
        playerNeeds -= botFives; 
    } else if (num == 6) {
        playerNeeds -= botSixes; 
    } else {
        throw new Error(`How did we get that?`);
    }
    

    if (playerNeeds == 1) { // player needs to roll one of that value to sastify claim
        playerProbability += 1 - (5/6) ** playerDiceCount;
    } else { //if (playerNeeds > 1 && playerNeeds < 7)
        // console.log(`bot is caculating probabilty`);
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
            playerProbability += combination(playerDiceCount, index) * ((1/6) ** index) * ((5/6) ** (playerDiceCount - index));
        }
    }
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
    return counter >= amountOfNum; 
}


function botCheckBotRoll() { // i think this works didn't check tho
    // we have to reset values to make it work
    let botOnes = 0;
    let botTwos = 0;
    let botThrees = 0;
    let botFours = 0;
    let botFives = 0;
    let botSixes = 0;


    // console.log(`amount of 1's ${ones}`);
    for (let offset = 0; offset < botDiceCount; offset++) {
        if (botRoll[offset] == 1) {
            botOnes++;
        } else if (botRoll[offset] == 2) {
            botTwos++;
        } else if (botRoll[offset] == 3) {
            botThrees++;
        } else if (botRoll[offset] == 4) {
            botFours++;
        } else if (botRoll[offset] == 5) {
            botFives++;
        } else if (botRoll[offset] == 6) {
            botSixes++;
        } else {
            throw new Error(`How did we roll that?`);
        }
    }
}

function botTranslatePlayerPart1() { // assumes playerResponse is valid (so check playerResponse before calling this)
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

function botTranslatePlayerPart2() {
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

function botTranslatorValid1(toBeTranslated) {
    if (toBeTranslated.includes(`one`)) {
        return 1; 
    } else if (toBeTranslated.includes(`two`)) {
        return 2;
    } else if (toBeTranslated.includes(`three`)) {
        return 3;
    } else if (toBeTranslated.includes(`four`)) {
        return 4;
    } else if (toBeTranslated.includes(`five`)) {
        return 5;
    } else if (toBeTranslated.includes(`six`)) {
        return 6;
    } else if (toBeTranslated.includes(`seven`)) {
        return 7;
    } else if (toBeTranslated.includes(`eight`)) {
        return 8;
    } else if (toBeTranslated.includes(`nine`)) {
        return 9;
    } else if (toBeTranslated.includes(`ten`)) { 
        return 10;
    } else  {
        throw new Error(`toBeTranslated input seems to be invalid?`);
    }
}

function botTranslatorValid2(toBeTranslated) {
    if (toBeTranslated.includes(`1`)) {
        return 1; 
    } else if (toBeTranslated.includes(`2`)) {
        return 2;
    } else if (toBeTranslated.includes(`3`)) {
        return 3;
    } else if (toBeTranslated.includes(`4`)) {
        return 4;
    } else if (toBeTranslated.includes(`5`)) {
        return 5;
    } else if (toBeTranslated.includes(`6`)) {
        return 6;
    } else {
        throw new Error(`toBeTranslated input seems to be invalid?`);
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
    return `\nBot's roll: \n${tempString} \n`;
}

function printQuestions() {
    let tempString = ``;
    for (let offset = 0; offset < botDiceCount; offset++) {
        if (offset == botDiceCount - 1) {
            tempString += `?`;
        } else {
            tempString += `?, `;
        }
    }
    return tempString;
}

function playerMove() {
    playerResponse = READLINE.question(`Your turn: `);
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
        } else if (move == `call` && movesCalled.length == 0) {
            throw new Error(`Can't call on first move`);
        }
    } catch { //catching error
        console.log(`\nThat move is invalid or is lower than the perivous guess. Please first type the how many times you think a number appears and then the number. Or "call" if you want to call.\nEx. "one 1" or "three 4's" \nInput "Valid Moves" for a list of moves you can perform \n`);
        playerMove();
        checkValidMove(playerResponse);
    }
}

function checkCall(lastMoveWas) {

    totalOnes = 0;
    totalTwos = 0;
    totalThrees = 0;
    totalFours = 0;
    totalFives = 0;
    totalSixes = 0;

    for (let offset = 0; offset < botDiceCount; offset++) {
        if (botRoll[offset] == 1) {
            totalOnes++;
        } else if (botRoll[offset] == 2) {
            totalTwos++;
        } else if (botRoll[offset] == 3) {
            totalThrees++;
        } else if (botRoll[offset] == 4) {
            totalFours++;
        } else if (botRoll[offset] == 5) {
            totalFives++;
        } else if (botRoll[offset] == 6) {
            totalSixes++;
        } else {
            throw new Error(`How did we roll that?`);
        }
    }

    for (let offset = 0; offset < playerDiceCount; offset++) {
        if (playerRoll[offset] == 1) {
            totalOnes++;
        } else if (playerRoll[offset] == 2) {
            totalTwos++;
        } else if (playerRoll[offset] == 3) {
            totalThrees++;
        } else if (playerRoll[offset] == 4) {
            totalFours++;
        } else if (playerRoll[offset] == 5) {
            totalFives++;
        } else if (playerRoll[offset] == 6) {
            totalSixes++;
        } else {
            throw new Error(`How did we roll that?`);
        }
    }


    // console.log(`\ntotalOnes ${totalOnes}`);
    // console.log(`totalTwos ${totalTwos}`);
    // console.log(`totalThrees ${totalThrees}`);
    // console.log(`totalFours ${totalFours}`);
    // console.log(`totalFives ${totalFives}`);
    // console.log(`totalSixes ${totalSixes}`);
    // console.log(`amountOfNum is ${amountOfNum}`);
    // console.log(`num is ${num}`);

    if (lastMoveWas == `player`) { // check player vars
        console.log(`Bot: call \n`);
        
        if (num == 1) {
            if (amountOfNum <= totalOnes)  { 
                removeBotDice();
                console.log(`There are at least ${playerResponse}!`);
                return `bot`;
            } else {
                removePlayerDice();
                console.log(`There aren't at least ${playerResponse}!`);
                return `player`;
            }
        } else if (num == 2) {
            if (amountOfNum <= totalTwos)  { 
                removeBotDice();
                console.log(`There are at least ${playerResponse}!`);
                return `bot`;
            } else {
                removePlayerDice();
                console.log(`There aren't at least ${playerResponse}!`);
                return `player`;
            }
        } else if (num == 3) {
            if (amountOfNum <= totalThrees)  { 
                removeBotDice();
                console.log(`There are at least ${playerResponse}!`);
                return `bot`;
            } else {
                removePlayerDice();
                console.log(`There aren't at least ${playerResponse}!`);
                return `player`;
            }
        } else if (num == 4) {
            if (amountOfNum <= totalFours)  { 
                removeBotDice();
                console.log(`There are at least ${playerResponse}!`);
                return `bot`;
            } else {
                removePlayerDice();
                console.log(`There aren't at least ${playerResponse}!`);
                return `player`;
            }
        } else if (num == 5) {
            if (amountOfNum <= totalFives)  { 
                removeBotDice();
                console.log(`There are at least ${playerResponse}!`);
                return `bot`;
            } else {
                removePlayerDice();
                console.log(`There aren't at least ${playerResponse}!`);
                return `player`;
            }
        } else if (num == 6) {
            if (amountOfNum <= totalSixes)  { 
                removeBotDice();
                console.log(`There are at least ${playerResponse}!`);
                return `bot`;
            } else {
                removePlayerDice();
                console.log(`There aren't at least ${playerResponse}!`);
                return `player`;
            }
        } else {
            throw new Error(`How did we roll that?`);
        } 
    }

    if (lastMoveWas == `bot`) { // check bot vars
        console.log(`\nPlayer has called\n`);

        if (botNum == 1) {
            if (botAmountOfNum <= totalOnes)  { 
                removePlayerDice(); 
                console.log(`There are at least ${botResponse.substr(6)}!`);
                return `player`;
            } else {
                removeBotDice();
                console.log(`There aren't at least ${botResponse.substr(6)}!`);
                return `bot`;
            }
        } else if (botNum == 2) {
            if (botAmountOfNum <= totalTwos)  { 
                removePlayerDice();
                console.log(`There are at least ${botResponse.substr(6)}!`);
                return `player`;
            } else {
                removeBotDice();
                console.log(`There aren't at least ${botResponse.substr(6)}!`);
                return `bot`;
            }
        } else if (botNum == 3) {
            if (botAmountOfNum <= totalThrees)  { 
                removePlayerDice();
                console.log(`There are at least ${botResponse.substr(6)}!`);
                return `player`;
            } else {
                removeBotDice();
                console.log(`There aren't at least ${botResponse.substr(6)}!`);
                return `bot`;
            }
        } else if (botNum == 4) {
            if (botAmountOfNum <= totalFours)  { 
                removePlayerDice();
                console.log(`There are at least ${botResponse.substr(6)}!`);
                return `player`;
            } else {
                removeBotDice();
                console.log(`There aren't at least ${botResponse.substr(6)}!`);
                return `bot`;
            }
        } else if (botNum == 5) {
            if (botAmountOfNum <= totalFives)  { 
                removePlayerDice();
                console.log(`There are at least ${botResponse.substr(6)}!`);
                return `player`;
            } else {
                removeBotDice();
                console.log(`There aren't at least ${botResponse.substr(6)}!`);
                return `bot`;
            }
        } else if (botNum == 6) { 
            if (botAmountOfNum <= totalSixes)  { 
                removePlayerDice(); 
                console.log(`There are at least ${botResponse.substr(6)}!`);
                return `player`;
            } else {
                removeBotDice();
                console.log(`There aren't at least ${botResponse.substr(6)}!`);
                return `bot`;
            }
        } else {
            throw new Error(`How did we roll that?`);
        } 
    }
}


function removePlayerDice() {
    console.log(`Player has lost a dice!`);
    playerDiceCount--;
}

function removeBotDice() { 
    console.log(`Bot has lost a dice!`); 
    botDiceCount--;
}

function checkYesNo(input) {
    while (input != `yes` && input != `no`) {
        input = READLINE.question(`Please enter "Yes" or "No"\n`);
        input = input.toLowerCase();
    } 
    return input
}

function cont() {
    contin = READLINE.question(`\nPress enter to continue \n`);
}

function resetVars() { // only important vars get reset
    playerRoll = []; 
    botRoll = []; 
    playerResponse = ``;
    movesCalled = [];
}

function revealAllDice() {
    console.log(`\nBot's Roll was `)
    console.log(`${printArray(botRoll)}`);
    console.log(`\nYour Roll was `);
    console.log(`${printArray(playerRoll)}\n`);
}

function welcome() {
    console.log(`\nWelcome to Swindle Stones! (Also known as liar's dice)`);
    tutorial = READLINE.question(`\nWould you like a  tutorial? (Yes / No) \n`);
    tutorial = tutorial.toLowerCase();
    tutorial = checkYesNo(tutorial); 

    if (tutorial == `yes`) {
        tutorialSim();
    }
}

function printDiceValues() {
    console.log(printOpponentRoll());
    console.log(`Your Roll`);
    console.log(`${printArray(playerRoll)}`);
}

function resetGame() {
    playerDiceCount = 5; // subj to change
    playerRoll = [];
    playerResponse = ``; 
}

function firstGoesAfterLoss() {
    if (loser == `player`) {
        gameState = `player turn`;
    } else if (loser == `bot`) {
        gameState = `bot turn`;
    } else {
        throw new Error(`who's the loser????`);
    }
}

function tutorialSim() {
    //line for line sake
    console.log(`--------------------------------------------------------------------------------------------------------------`);
    console.log(`***** Tutorial ****`);
    console.log(`\nIn Swindle Stones (or liar's dice) each player initally recieves 5 die (six sided).\n`);
    
    
    console.log(`Bot's Roll`);
    console.log(printQuestions());
    console.log(`\nYour Roll`);
    console.log(printQuestions());

    cont();

    // console.log(`--------------------------------------------------------------------------------------------------------------`);
    console.log(`\nYou only to get to see the values that you roll`);

    rollDice();

    printDiceValues();

    cont();

    console.log(`\nEach player takes turn guessing how mamy times a number is rolled. (Ex. "one 1" or "three 4's" | Typing Your Guesses: First type how many times you think a number is rolled, followed by the actual number)`);

    console.log(`\nLet's see what your opponent guesses`);
    botResponse = bot(playerResponse)
    console.log(botResponse);

    printDiceValues();

    cont();

    console.log(`\nYou can either "call" if you think your opponent's guess is "wrong" (only overestimating how many times a number appears is wrong) or guess yourself, but your guess must be higher than the pevious guess. (Ex. "one 5" is higher than "one 1" and "two 1's" is higher than "one 5"`);
    
    printDiceValues();

    console.log(`\nTry making a move!`);
    playerMove();
    checkValidMove(playerResponse);

    console.log(`\nNice!`);

    if (playerResponse ==  `call`) {
        console.log(`\nYou decide to call!`);
        cont();

        console.log(`\nWhen someone calls out a guess all dice values are revealed and we check to see if the guess is "wrong". If the guess is wrong the player who made the guess loses a dice. If the guess is right the player who called the guess out loses a dice.`);

        loser = checkCall(`bot`);

        revealAllDice();

    } else {
        console.log(`Let's see what the bot does!`);
        cont();

        console.log(`\nThe bot decides to call!`);

        console.log(`\nWhen someone calls out a guess all dice values are revealed and we check to see if the guess is "wrong". If the guess is wrong the player who made the guess loses a dice. If the guess is right the player who called the guess out loses a dice.`);

        // doesn't translate (bot usually does it but i don't wanna call it again) so this here
        amountOfNum = botTranslatePlayerPart1(); 
        num = botTranslatePlayerPart2();

        loser = checkCall(`player`);

        revealAllDice();
    }

    cont();

    console.log(`After a call, dice are rolled for new values and the player who most recently lost a dice goes first.`);

    resetVars();
    rollDice();
    printDiceValues();


    cont();

    console.log(`\nThe game ends when the opposing player loses all of their dice`);

    console.log(`\nNow that you know how to play, play the rest of this game!`);

    firstGoesAfterLoss();
    
    // goes right into gameSim();

}

function gameSim() {

    if (gameState == ``) {
        gameState = `player turn`;
        rollDice(); // for first round
    }
                
    while (playerDiceCount > 0 && botDiceCount > 0) {

        while (gameState == `player turn`) {
            console.log(printOpponentRoll());
            console.log(`Your Roll`);
            console.log(`${printArray(playerRoll)}\n`);
            
            // Player's Turn
            playerMove();
            checkValidMove(playerResponse);
            
            if (playerResponse == `call`) {
                gameState = `player call`;
            }  else {
                gameState = `bot turn`;
            }

        }

        while (gameState == `bot turn`) {
            // Bot's Turn
            botResponse = bot(playerResponse);
            // console.log(`gets pass response`);

            if (botResponse == `call`) {
                gameState = `bot call`;
            } else if (botResponse == `undefined`) {
                throw new Error(`bot didn't give valid answer`);
            } else if (botResponse != `call`) {
                console.log(botResponse);
                gameState = `player turn`;
            } 
        } 
        
        if (gameState == `player call`) {
            loser = checkCall(`bot`);

            revealAllDice();

            gameState = `new roll`;


        } else if (gameState == `bot call`) {

            loser = checkCall(`player`);

            revealAllDice();

            gameState = `new roll`;
        } else if (gameState == `new roll`) {
            cont();
            // old dice values erased 
            console.log(`Next Round!`);
            resetVars();

            // new dice values assigned 
            rollDice(); 
            firstGoesAfterLoss();
        }
    }

    if (playerDiceCount == 0) {
        console.log(`\nBot wins!`);
    } else if (botDiceCount == 0) {
        console.log(`\nYou win!`);
    }
}

function goodbye() {
    console.log(`\nThanks For Playing Swindle Stones! Can't wait to play again! \n`);
}

function main() {
    keepPlaying = `yes`;
    console.log(`******* NEW TEST *******`)

    welcome();
    while (keepPlaying ==  `yes`) {
        gameSim();
        keepPlaying = READLINE.question(`\nWould you like to play again? (Yes / No)\n`);
        keepPlaying = keepPlaying.toLowerCase();
        keepPlaying = checkYesNo(keepPlaying);
        resetGame();
    }
    goodbye();
}

main();
