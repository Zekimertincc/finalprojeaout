var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
let startButton = document.querySelector(".start");
const timerElement = document.querySelector('.timer');
const levelSet = document.querySelector("#level")
let intervalId;
let timerInterval;

startButton.addEventListener("click", function() {
    GameLoop();
});

function drawCircle(radius) {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'transparent';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#003300';
    context.stroke();
}

function drawCircleWithDelay(radius) {
    setTimeout(function() {
        drawCircle(radius);
        if (radius < 200) {
            drawCircleWithDelay(radius + 50);
        }
    }, 500);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function GameLoop(){
    const duration = 60000; // 1 dakika (60 saniye) milisaniye cinsinden
    const startTime = new Date();

    function animateRound() {
        clearCanvas();
        drawCircleWithDelay(50);
    }

    animateRound();

    // Seviyeye göre interval zamanını belirle
    if (levelSet.value === "1" ){
        intervalId = setInterval(animateRound, 3000);
    }
    else if (levelSet.value ===  "2" ){
        intervalId = setInterval(animateRound, 5000);
    } else if (levelSet.value ===  "3" ){
        intervalId = setInterval(animateRound, 8000);
    }
    
    setTimeout(() => {
        clearInterval(intervalId);
        clearInterval(timerInterval);
        timerElement.textContent = "Süre Doldu!";
    }, duration);

    // Timer'ı her 100ms'de bir güncelle
    timerInterval = setInterval(function() {
        const remainingTime = duration - (new Date() - startTime);
        const seconds = Math.ceil(remainingTime / 1000);
        timerElement.textContent = `Kalan Zaman: ${seconds} saniye`;
    }, 100);
}
