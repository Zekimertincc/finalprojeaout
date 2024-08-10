const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const timerElement = document.querySelector(".timer");
const levelSet = document.querySelector("#level");
let timerInterval;

function drawRectangle(x, y) {
    ctx.beginPath();
    ctx.rect(centerX - x / 2, centerY - y / 2, x, y);
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const startButton = document.querySelector('.start');
startButton.addEventListener('click', function() {
    GameLoop();
});

function animateRound() {
    for (let i = 1; i <= 6; i++) {
        setTimeout(() => {
            drawRectangle(50 * i + 50, 50 * i);
        }, i * getInterval());
    }
}

function getInterval() {
    // Seviyeye göre interval zamanını belirle
    if (levelSet.value === "1" ){
        return 1000;
    }
    else if (levelSet.value ===  "2" ){
        return 800;
    } else if (levelSet.value ===  "3" ){
        return 500;
    }
}

function startAnimation() {
    animateRound();
    setTimeout(() => {
        clearCanvas();
        startAnimation();
    }, 7000);
}

function GameLoop() {
    const duration = 60000; // 1 dakika (60 saniye) milisaniye cinsinden
    const startTime = new Date();

    startAnimation();

    // Timer'ı güncelle
    timerInterval = setInterval(function() {
        const remainingTime = duration - (new Date() - startTime);
        const seconds = Math.ceil(remainingTime / 1000);
        timerElement.textContent = `Kalan Zaman: ${seconds} saniye`;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
        }
    }, 100);

    setTimeout(() => {
        clearInterval(timerInterval);
        timerElement.textContent = "Süre Doldu!";
        clearCanvas();
    }, duration);
}
