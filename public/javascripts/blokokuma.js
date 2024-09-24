let metin1 = "Hiç sen bir su değirmeninin içini dolaştın mı adaşım?\n" +
"Görülecek şeydir o... Yamulmuş duvarlar, tavana yakın\n" +
"ufacık pencereler ve kalın kalasların üstünde simsiyah bir çatı... Sonra bir sürü çarklar, kocaman taşlar, miller, sıçraya sıçraya dönen tozlu kayışlar... Ve bir köşede birbiri üstüne yığılmış\n" +
"buğday, mısır, çavdar, her çeşitten ekin çuvalları. Karşıda beyaz\n" +
"torbalara doldurulmuş unlar...\n" +
"Taşların yanında, duman halinde, sıcak ve ince zerreler\n" +
"uçuşur. Halbuki döşemedeki küçük kapağı kaldırınca aşağıdan\n" +
"doğru sis halinde soğuk su damlaları insanın yüzüne yayılır...\n" +
"Ya o seslere ne dersin adaşım, her köşeden ayrı ayrı makamlarda çıkıp da kulağa hep birlikte kocaman bir dalga halinde dolan seslere?.. Yukarıdaki tahta oluktan inen sular, kavak\n" +
"ağaçlarında esen kış rüzgân gibi uğuldar, taşlann kâh yükselen, kâh alçalan ağlamaklı sesleri kayışların tokat gibi şaklayışına kanşır... Ve mütemadiyen dönen tahtadan çarklar gıcırdar,\n" +
"gıcırdar\n" +
"Ben çok eskiden böyle bir değirmen görmüştüm adaşım,\n" +
"ama bir daha görmek istemem.";

const blokkelime = document.querySelector(".blokkelime");
const startButton = document.querySelector(".start");
const levelSet = document.getElementById("level");
const timerElement = document.querySelector(".timer");
let index = 0;
let intervalId;
let timerInterval;


startButton.addEventListener("click", function() {
    oyunLoop();
});

function kelimeVer() {
    // Metni boşluklara göre ayır
    let kelimeListesi = metin1.split(" ");
    // İndeks sıfıra ulaştığında yeniden başlat
    if (index >= kelimeListesi.length) {
        index = 0;
    }
    // Blok kelimeyi güncelle
    blokkelime.textContent = kelimeListesi[index];
    // İndeksi bir sonraki kelimeye taşı
    index++;
}

function oyunLoop() {
    // Seçilen zorluk seviyesine göre interval süresini belirle
    let intervalTime;
    if (levelSet.value === "1") {
        intervalTime = 1000;
    } else if (levelSet.value === "2") {
        intervalTime = 900;
    } else if (levelSet.value === "3") {
        intervalTime = 500;
    }

    // İlk kelimeyi göster
    kelimeVer();

    // Belirlenen aralıklarla bir sonraki kelimeyi göster
    intervalId = setInterval(kelimeVer, intervalTime);

    const duration = 60000; // 1 dakika (60 saniye) milisaniye cinsinden
    const startTime = new Date();

    setTimeout(() => {
        clearInterval(intervalId);
        clearInterval(timerInterval);
        timerElement.textContent = "Süre Doldu!";

        saveExerciseCount();
    }, duration);

    // Timer'ı her 100ms'de bir güncelle
    timerInterval = setInterval(function() {
        const remainingTime = duration - (new Date() - startTime);
        const seconds = Math.ceil(remainingTime / 1000);
        timerElement.textContent = `Kalan Zaman: ${seconds} saniye`;
    }, 100);


    // Oyun bittiğinde egzersiz sayısını kaydet
    async function saveExerciseCount() {
        const exerciseData = {
            egzersiz: "Blok okuma", // Or any identifier for your game/exercise
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



}
