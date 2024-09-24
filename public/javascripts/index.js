
// açılan dikey  ve yatay başlangıç

const emojis = ["☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝"];
const startButton = document.querySelector(".start");
const board1 = document.querySelector(".board1");
const board2 = document.querySelector(".board2");
const board3 = document.querySelector(".board3");
const board4 = document.querySelector(".board4");
const board5 = document.querySelector(".board5");
const board6 = document.querySelector(".board6");
const board7 = document.querySelector(".board7");
const board8 = document.querySelector(".board8");
const levelSet = document.querySelector("#level")
let gameOn = false;
let index;


startButton.addEventListener("click", function() {

        animateEmojis();
        

});



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function animateEmojis() {
    function animateEmojis() {
        const duration = 60000; // Bir dakika (60 saniye) milisaniye cinsinden
        
        // Geriye kalan zamanı göstermek için p etiketini seç
        const timerElement = document.querySelector('.timer');
        
        function animateRound() {
            
            clearBoard();
            shuffleArray(emojis);
            kartDağıt();
        }
        
        // İlk animasyonu hemen başlat
        animateRound();
        
        // Her saniyede bir animateRound fonksiyonunu çağır
        

        let intervalId = setInterval(animateRound, 1000);
        if (levelSet.value === 1 ){
            intervalId = setInterval(animateRound, 1000);
        }
        else if (levelSet.value ===  2 ){
            intervalId = setInterval(animateRound, 2000);
        }else if (levelSet.value ===  3 ){
            intervalId = setInterval(animateRound, 2000);
        }

        
        // Belirli bir süre sonra animasyonu durdur
        setTimeout(() => {
            clearInterval(intervalId);
        }, duration);
        
        // Geriye kalan zamanı güncelle
        const updateTimer = () => {
            const remainingTime = duration - (new Date() - startTime);
            const seconds = Math.ceil(remainingTime / 1000);
            timerElement.textContent = `Kalan Zaman: ${seconds} saniye`;
        };

        // Başlangıç zamanını kaydet
        const startTime = new Date();

        // Her saniyede bir zamanı güncelle
        const timerInterval = setInterval(updateTimer, 1000);

        // Belirli bir süre sonra zamanı durdur
        setTimeout(() => {
            clearInterval(timerInterval);
            timerElement.textContent = "Süre Doldu!";
            saveExerciseCount();
        }, duration);
    }

    // Animasyonu başlat
    animateEmojis();
    
}

function kartDağıt() {
    const delay = 100; // Adjust the delay time as needed
    const boards = [board1, board2, board3, board4, board5,board6,board7];

    for (let i = 0; i < boards.length; i++) {
        setTimeout(() => {
            // Rastgele bir emoji seçmek için emojis dizisinden bir indeks al
            const randomIndex = Math.floor(Math.random() * emojis.length);
            // Seçilen rastgele emoji'yi kartın içeriği olarak ayarla
            boards[i].innerHTML = emojis[randomIndex];
        }, i * delay);
    }
    

/*
    boards.forEach((board, index) => {
        setTimeout(() => {
            board.innerHTML = emojis[index];
        }, index * delay);
    });

    */
}


function clearBoard() {
    board1.innerHTML = '';
    board2.innerHTML = '';
    board3.innerHTML = '';
    board4.innerHTML = '';
    board5.innerHTML = '';
    board6.innerHTML = '';
    board7.innerHTML = '';
}



// dikey ve yatay bitiş


 // Oyun bittiğinde egzersiz sayısını kaydet
 async function saveExerciseCount() {
    const exerciseData = {
        egzersiz: "Açılan nesneler yatay", // Or any identifier for your game/exercise
        count: index // kaç kere yapıldığı
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





