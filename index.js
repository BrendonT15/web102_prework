/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';    // THE LIST GAMES IS EXPORTED FROM games.js

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA) // THEN IMPORTED AS A LIST THROUGH PARSING, WHERE GAMES_JSON HOLDS THE DATA

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
        for(let i = 0; i < games.length; i++) {
            const game = games[i]; // WILL NOW HOLD THE GAME IN THIS VARIABLE
            // create a new div element, which will become the game card
            const gameCard = document.createElement('div');  // INITIALIZES gameCard as a DOM element

            // add the class game-card to the list
            gameCard.classList.add('game-card');
            // set the inner HTML using a template literal to display some info 
            // about each game
            gameCard.innerHTML = `
                <h3>${game.name}</h3>
                <img src=${game.img} alt='${game.name} image'/>
                <p>${game.description}</p> 
                <p>Goal: ${game.goal}</p>
            `;
            // TIP: if your images are not displaying, make sure there is space
            // between the end of the src attribute and the end of the tag ("/>")


            // append the game to the games-container
            gamesContainer.appendChild(gameCard);
        }

};

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((t, contributions) =>{
    return t + contributions.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    <p>${totalContributions.toLocaleString('en-US')}</p>
`;
// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const amountRaised = GAMES_JSON.reduce((r, raised) => {
    return r + raised.pledged;
}, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `
    <p>$${amountRaised.toLocaleString('en-US')}</p>
`

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.length;

gamesCard.innerHTML = `
    <p>${totalGames.toLocaleString('en-US')}</p>
`

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfunded = GAMES_JSON.filter((g) => {
        return g.pledged < g.goal
    });

    unfunded.forEach((g) =>{
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        gameCard.innerHTML = `
                <h3>${g.name}</h3>
                <img src=${g.img} alt='${g.name} image'/>
                <p>${g.description}</p> 
                <p>Goal: ${g.goal}</p>
            `;

            gamesContainer.appendChild(gameCard);
    });
    // ^
    // use the function we previously created to add the unfunded games to the DOM
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const funded = GAMES_JSON.filter((g) => {
        return g.pledged > g.goal;
    })

    funded.forEach((g) =>{
        const gameCard = document.createElement('div'); // CREATING A DIV CALLED GAMECARD
        gameCard.classList.add('game-card'); // CREATES A CSS CLASS TO THE HTML ELEMENT: GAMECARD
        gameCard.innerHTML = `
            <h3>${g.name}</h3>
            <img src=${g.img} alt='${g.name} image'/>
            <p>${g.description}</p> 
            <p>Goal: ${g.goal}</p>
        `
        gamesContainer.appendChild(gameCard); // APPENDS GAMECARD INSIDE OF THE <> OF GAMESCONTAINER
    });
    // ^
    // use the function we previously created to add unfunded games to the DOM
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
};

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn"); // GRAB BUTTONS FROM HTML DOC
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);  // GIVING THE VARIABLE CONTAINING THE BUTTON EVENT HANDLERS
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);
/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numUnfunded = GAMES_JSON.filter((g) => {
        return g.pledged < g.goal;
}).length;

const gamesFunded = GAMES_JSON.filter((g) => {
    return g.pledged > g.goal;
});

const numGames = GAMES_JSON.length

const totalPledgedFunded = GAMES_JSON.reduce((amt, game) => {
    return amt + game.pledged;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = 
    `A total of $${totalPledgedFunded.toLocaleString('en-US')} has been raised for ${numGames} games. 
    ${numUnfunded > 0 
        ? `Currently, ${numUnfunded} game${numUnfunded > 1 ? 's' : ''} remain${numUnfunded > 1 ? '' : 's'} unfunded. We need your help to fund these amazing games!` 
        : 'All games have been successfully funded!'}`;

// create a new DOM element containing the template string and append it to the description container
const unfundedDescription = document.createElement('div');

unfundedDescription.classList.add('unfunded-description');
unfundedDescription.innerHTML = `
    <p>${displayStr}</p>
`

descriptionContainer.appendChild(unfundedDescription)

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;   // GIVES THE FUNCTION INSTRUCTIONS OF HOW TO SORT ITEMS
});

// use destructuring and the spread operator to grab the first and second games
const[firstGame, secondGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameContent = document.createElement('div');

firstGameContent.classList.add('first-game')

firstGameContent.innerHTML = `
    ${firstGame.name}
`
firstGameContainer.appendChild(firstGameContent);

// do the same for the runner up item\
const secondGameContent = document.createElement('div');

secondGameContent.classList.add('second-game')

secondGameContent.innerHTML = `
    ${secondGame.name}
`

secondGameContainer.appendChild(secondGameContent);

// OPTIONAL SEARCH BAR
const searchElement = document.getElementById('search-bar');

function searchListOnly(val){
    // RESET GAME CONTAINER
    deleteChildElements(gamesContainer);

    // FILTER 
    const searchList = GAMES_JSON.filter((game) => {
        return game.name.toLowerCase().includes(val.toLowerCase());
    });

    searchList.forEach((game) => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        gameCard.innerHTML = `
                <h3>${game.name}</h3>
                <img src=${game.img} alt='${game.name} image'/>
                <p>${game.description}</p> 
                <p>Goal: ${game.goal}</p>
            `;

        gamesContainer.appendChild(gameCard);
    });

}

searchElement.addEventListener('input', () => {
    searchListOnly(searchElement.value);
});
searchListOnly('');