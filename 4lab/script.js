let consecutive = 0;
let score = 0;
let flippedCards = [];
let isFlipping = false;

let cardsArray = [];

const diff = {
    "easy": "Lengvas",
    "medium": "Vidutinis",
    "hard": "Sunkus"
}

updateLeaderboard();

function toggleScreen() {
    const gameScreen = document.querySelector("#game");
    const menuScreen = document.querySelector("#menu");

    gameScreen.classList.toggle("hidden");
    menuScreen.classList.toggle("hidden");
}

function generateShuffledPairs(n) {
    const pairs = [];
    while (pairs.length < n / 2) {
        const randomNum = Math.floor(Math.random() * 99) + 1;
        if (!pairs.includes(randomNum)) {
            pairs.push(randomNum);
        }
    }

    const resultArray = [...pairs, ...pairs];

    for (let i = resultArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultArray[i], resultArray[j]] = [resultArray[j], resultArray[i]]; // Swap
    }

    return resultArray;
}


function startGame(n, diff) {
    const board = document.querySelector("#board");
    board.innerHTML = "";
    board.removeAttribute("class");
    board.classList.add(diff)
    const numbers = generateShuffledPairs(n);
    for(let number of numbers) {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<div class="front"></div><div class="back">${number}</div>`;
        card.addEventListener("click", () => flipCard(card));
        cardsArray.push(card);
        board.appendChild(card);
    }
    score = 0;
    document.querySelector("#score").innerHTML = 0;
    toggleScreen();
}

function guessedCorrectly() {
    consecutive += 1;
    const scoreElement = document.querySelector("#score");
    score = score + 100 * consecutive;

    scoreElement.innerHTML = score;
}

function flipCard(element) {
    if (isFlipping || flippedCards.length >= 2 || flippedCards.includes(element)) {
        return;
    }

    element.classList.add("show");
    flippedCards.push(element);

    if (flippedCards.length === 2) {
        isFlipping = true;

        if (
            flippedCards[0].querySelector(".back").innerHTML ===
            flippedCards[1].querySelector(".back").innerHTML
        ) {
            guessedCorrectly();
            setTimeout(() => {
                flippedCards[0].classList.add("clear");
                flippedCards[1].classList.add("clear");
                resetFlippedCards();
                checkWin();
            }, 500);
        } else {
            consecutive = 0;
            setTimeout(() => {
                flippedCards[0].classList.remove("show");
                flippedCards[1].classList.remove("show");
                resetFlippedCards();
            }, 1000);
        }
    }
}

function resetFlippedCards() {
    flippedCards = [];
    isFlipping = false;
}

function checkWin() {
    let cleared = 0;
    for(let card of cardsArray) {
        if(card.classList.contains("clear")) cleared++;
    }

    if(cleared == cardsArray.length) {
        console.log("win");
        let bestScores = JSON.parse(sessionStorage.getItem('bestScores')) || [];
        let vardas = "Anonimas";
        if(document.querySelector("input").value !== "") {
            vardas = document.querySelector("input").value;
        }
        bestScores.push({"vardas": vardas, "taskai": score, "sunkumas": diff[document.querySelector("#board").classList[0]]})
        bestScores.sort((a,b) => parseInt(b.taskai) - parseInt(a.taskai));
        sessionStorage.setItem('bestScores', JSON.stringify(bestScores));
        updateLeaderboard();
        alert("Jūs laimėjote!");
        toggleScreen();
    }
}

function updateLeaderboard() {
    let bestScores = JSON.parse(sessionStorage.getItem('bestScores')) || [];
    const leaderBoard = document.querySelector("tbody");
    leaderBoard.innerHTML = "";
    for(let score of bestScores) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${score.vardas}</td>
            <td>${score.taskai}</td>
            <td>${score.sunkumas}</td>
        `;
        leaderBoard.appendChild(row);
    }
}