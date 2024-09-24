let metin1 = "";
const startButton = document.querySelector(".start");
const levelSet = document.getElementById("level");
const timerElement = document.querySelector(".timer");
const sahneElement = document.getElementById("sahne");
const textSelect = document.getElementById("text_select")
let index = 0;
let intervalId;
let timerInterval;
let metinlerDizisi = []; // Boş bir dizi olarak tanımlıyoruz

startButton.addEventListener("click", function() {
    fetchTexts().then(() => {
        oyunLoop();
    });
});

async function fetchTexts() {
    try {
        const response = await fetch('/fetch-texts'); // Assuming your server endpoint is '/fetch-texts'
        const texts = await response.json();
        metinlerDizisi = texts.map(item => item.metinler[0].metin); // metinlerDizisi'ni dolduruyoruz

        console.log("Fetched texts:", metinlerDizisi);
    } catch (error) {
        console.error('Error fetching texts:', error);
    }
}

function oyunLoop() {
    // Seçilen zorluk seviyesine göre interval süresini belirle
    let intervalTime;
    if (levelSet.value === "1") {
        intervalTime = 1000;
    } else if (levelSet.value === "2") {
        intervalTime = 700;
    } else if (levelSet.value === "3") {
        intervalTime = 500;
    }

    // Seçilen metni belirle
    if (textSelect.value === "1") {
        metin1 = metinlerDizisi[0];
    } else if (textSelect.value === "2") {
        metin1 = metinlerDizisi[1];
    } else if (textSelect.value === "3") {
        metin1 = metinlerDizisi[2];
    }

    // Metni sahneye ekle
    kelimeEkle();

    // Belirlenen aralıklarla bir sonraki kelimeyi görünür yap
    intervalId = setInterval(kelimeGoster, intervalTime);

    // Zamanlayıcıyı başlat
    const duration = 60000; // 1 dakika (60 saniye) milisaniye cinsinden
    const startTime = new Date().getTime();

    timerInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - startTime;
        const remaining = duration - elapsed;

        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        timerElement.textContent = `00:${seconds < 10 ? '0' + seconds : seconds}`;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            clearInterval(intervalId);
            timerElement.textContent = "00:00";
            // Egzersiz bittiğinde tüm kelimeleri görünür yap
            document.querySelectorAll('.kelime').forEach(kelime => kelime.classList.add('visible'));
            saveExerciseCount();
        }
    }, 1000);
}

function kelimeEkle() {
    // Sahnedeki tüm kelimeleri temizle
    sahneElement.innerHTML = "";

    // Metni boşluklara göre ayır
    const kelimeListesi = metin1.split(" ");

    // Her kelimeyi sahneye ekle
    kelimeListesi.forEach((kelime, index) => {
        let kelimeDiv = document.createElement("div");
        kelimeDiv.className = "kelime";
        kelimeDiv.textContent = kelime;
        kelimeDiv.id = `kelime-${index}`;
        sahneElement.appendChild(kelimeDiv);
    });
}

function kelimeGoster() {
    let kelimeDiv = document.getElementById(`kelime-${index}`);
    if (kelimeDiv) {
        kelimeDiv.classList.add("visible");
        index++;
    } else {
        clearInterval(intervalId);
    }
}

    // Oyun bittiğinde egzersiz sayısını kaydet
    async function saveExerciseCount() {
        const exerciseData = {
            egzersiz: "Gölgeleme çalışması", // Or any identifier for your game/exercise
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
