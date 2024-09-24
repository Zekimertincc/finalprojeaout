const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const timerElement = document.querySelector(".timer");
const levelSet = document.querySelector("#level");
let timerInterval;
let index;

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
            drawRectangle(50 * i, 50 * i); // Her seferinde yeni bir dikdörtgen çiz
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
        clearCanvas(); // Tüm dikdörtgenler çizildikten sonra canvas'ı temizle
        setTimeout(startAnimation, 1000); // Bir sonraki animasyona başlamadan önce 1 saniye bekle
    }, 7000); // Tüm dikdörtgenlerin çizilmesinden 1 saniye sonra temizle
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
        clearCanvas(); // Süre dolduğunda canvas'ı temizle
        saveExerciseCount();
    }, duration);
}
async function saveExerciseCount() {
    const exerciseData = {
        egzersiz: "Büyüyen kare  ", // Or any identifier for your game/exercise
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