//benzer kelimeler başlangıç

//kelimeleri yazdır rasgele - 16:09
//üstüne tıkladığında doğruysa doğru de yanlışsa yanlış
//zamanı göster
//hepsini seçinde bir daha karıştır
//zaman bitince bitsin kaç tıklamada kaç doğru yaptı söyle
const grid = document.querySelector(".grid");
const startButton = document.querySelector(".start");

// Kutu elementlerini tanımlayın
const kutu1 = document.querySelector(".kutuyazı1");
const kutu2 = document.querySelector(".kutuyazı2");
const kutu3 = document.querySelector(".kutuyazı3");
const kutu4 = document.querySelector(".kutuyazı4");
const kutu5 = document.querySelector(".kutuyazı5");
const kutu6 = document.querySelector(".kutuyazı6");
const kutu7 = document.querySelector(".kutuyazı7");
const kutu8 = document.querySelector(".kutuyazı8");
const kutu9 = document.querySelector(".kutuyazı9");
const kutu10 = document.querySelector(".kutuyazı10");
const kutu11 = document.querySelector(".kutuyazı11");
const kutu12 = document.querySelector(".kutuyazı12");
let index = 0;
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Kutu elementlerini bir diziye ekleyin
const kutular = [kutu1, kutu2, kutu3, kutu4, kutu5, kutu6, kutu7, kutu8, kutu9,kutu10,kutu11,kutu12];

// Kelimeleri tanımlayın
const ayni_kelimeler = ["Masa/Masa",
"Salkım/Salkım",
"Sarkı/Sarkı",
"Gözlük/Gözlük",
"Kalem/Kalem",
"Kuş/Kuş",
"Bardak/Bardak",
"Kapı/Kapı",
"kel/kel",
"çorba/çorba",
"güzel/güzel",
"kes/kes"
];

const es_sesli = [
    "ak/al",
    "bin/bit",
    "gör/gür",
    "el/öl",
    "uzun/üsün",
    "yol/yul",
    "saat/şat",
    "kap/kab",
    "su/sü",
    "kırık/kürük",
    "yak/yık",
    "kum/köm",
    "baş/boş",
    "kıyı/küyü",
    "göl/gül"
  ];
  

// Rastgele bir eleman seçen fonksiyon
function randomEleman(dizi) {
    return dizi[Math.floor(Math.random() * dizi.length)];
}

// Kutulara kelimeleri yerleştiren fonksiyon

function kelimeleriGöster() {
    const tumKelimeler = [...es_sesli, ...ayni_kelimeler]; // Tüm kelimeleri birleştir

    shuffleArray(tumKelimeler); // Tüm kelimeleri karıştır

    kutular.forEach((kutu, index) => {
        kutu.innerHTML = tumKelimeler[index];
        kutu.style.backgroundColor = "transparent"; // Önceki rengine geri dön
        kutu.classList.remove("tiklandi");
    });
}

    //zamanlayıcı başlangıç


    function timer() {
        const timerElement = document.querySelector('.timer');
        let remainingTime = 60; // 60 saniye (bir dakika)
    
        const updateTimer = () => {
            timerElement.textContent = `Kalan Zaman: ${remainingTime} saniye`;
            remainingTime--;
    
            if (remainingTime < 0) {
                clearInterval(intervalId);
                timerElement.textContent = "Süre Doldu!";

            }
        };
    
        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);
        
    }
    


// Fonksiyonu çağırın
    startButton.addEventListener("click", function() {
        kelimeleriGöster();
        timer(); 
        saveExerciseCount();
});



kutular.forEach(kutu => {
    kutu.addEventListener('click', function(event) {
        event.preventDefault(); // Tıklamanın varsayılan davranışını engelle

        if (es_sesli.includes(this.innerHTML)) {
            this.style.backgroundColor = "blue"; // Doğru kelimeyi tespit edince arka plan rengini değiştir
            tümKelimelerTıklandı(); // Tüm kelimelerin tıklandığını kontrol et
        }
    });
});


function tümKelimelerTıklandı() {
    let tümTıklandıMı = true;

    for (let i = 0; i < kutular.length; i++) {
        if (es_sesli.includes(kutular[i].innerHTML) && kutular[i].style.backgroundColor !== "blue") {
            tümTıklandıMı = false;
            break; // Tüm farklı kelimeler tıklanmadıysa döngüyü sonlandır
        }
    }

    if (tümTıklandıMı) {
        // Tüm farklı kelimeler doğru tıklandıysa
        // Tüm kutuların rengini değiştir
        kutular.forEach(kutu => {
            kutu.style.backgroundColor = "transparent"; // Eski rengine geri dön
        });
        
        // Yeni kelimeleri göster
        kelimeleriGöster();
    }
}

async function saveExerciseCount() {
    const exerciseData = {
        egzersiz: "Benzer Kelimeler", // Or any identifier for your game/exercise
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
