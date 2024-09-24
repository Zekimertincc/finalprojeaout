let round = 1;
let score = 0;
let gameTime = 30; // game time in seconds
let timer;
let correctSelections = 0;
let gameInProgress = true;
let index;
function startGame() {
    round = 1;
    score = 0;
    correctSelections = 0;
    document.getElementById('score').innerText = '';
    gameInProgress = true;
    nextRound();
    startTimer();
    document.querySelector('.btn-primary').style.display = 'none';
}

function endGame() {
    document.getElementById('instruction').innerText = `Oyun bitti! Skor: ${score}`;
    document.getElementById('gameArea').innerHTML = '';
    gameInProgress = false;
    saveExerciseCount();
}

function nextRound() {
    if (!gameInProgress) return;
    const numberOfBoxes = 2 ** round;
    const isOddRound = round % 2 !== 0;
    document.getElementById('instruction').innerText = isOddRound ? 'Tek sayıları seçin' : 'Çift sayıları seçin';
    generateBoxes(numberOfBoxes, isOddRound);
    correctSelections = 0;
    round++;
}

function generateBoxes(count, isOddRound) {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';
    let hasOdd = false;
    let hasEven = false;
    for (let i = 0; i < count; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        let number;
        do {
            number = Math.floor(Math.random() * 100);
        } while ((i < 2 && ((number % 2 === 0 && hasEven) || (number % 2 !== 0 && hasOdd))) || 
                 (i >= 2 && ((isOddRound && number % 2 === 0) || (!isOddRound && number % 2 !== 0)) && hasOdd && hasEven));

        box.innerText = number;
        box.onclick = () => checkNumber(number, isOddRound, box);
        gameArea.appendChild(box);

        if (number % 2 === 0) hasEven = true;
        else hasOdd = true;
    }
    if (count === 8) {
        gameArea.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
}

function checkNumber(number, isOddRound, box) {
    if (!gameInProgress) return;
    const isCorrect = (isOddRound && number % 2 !== 0) || (!isOddRound && number % 2 === 0);
    box.style.backgroundColor = isCorrect ? 'green' : 'red';
    if (isCorrect) {
        score++;
        correctSelections++;
        box.onclick = null;
    }

    // Ensure correctSelections matches the number of correct boxes in the round before proceeding
    const correctBoxes = Array.from(document.querySelectorAll('.box')).filter(box => {
        const boxNumber = parseInt(box.innerText);
        return (isOddRound && boxNumber % 2 !== 0) || (!isOddRound && boxNumber % 2 === 0);
    });

    if (correctSelections === correctBoxes.length) {
        setTimeout(nextRound, 500);
    }
}

function startTimer() {
    let timeLeft = gameTime;
    const timerElement = document.getElementById('timer');
    timerElement.innerText = `Süre: ${timeLeft} saniye`;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Süre: ${timeLeft} saniye`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}
async function saveExerciseCount() {
    const exerciseData = {
        egzersiz: "tek çift ", // Or any identifier for your game/exercise
        count: index // The count of words displayed
    };

    try {
        const response = await fetch('/saveegcount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exerciseData)
        });

        if (!response.ok) {
            throw new Error('Failed to save exercise count');
        }

        console.log('Exercise count saved successfully');
    } catch (error) {
        console.error('Error saving exercise count:', error);
    }
}
