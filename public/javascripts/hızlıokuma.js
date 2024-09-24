const startButton = document.querySelector(".start");
const timerElement = document.querySelector(".timer");
const başlık = document.querySelector(".başlık");
const metin = document.querySelector(".text");
const levelSelect = document.querySelector("#level");
const egzersizBitir = document.querySelector(".bitir");
const sonyazı = document.querySelector("#sonyazı");
let timerInterval;
let süre;
let highScore = 0;
let kelimeSayisi;
let metinlerDizisi = [];
let oyunAd = "hızlıokuma";
let metin1 = "";
let başlıkListesi = [];

window.onload = function () {
    checkLoginStatus();
};

function metinGöster() {
    clearInterval(timerInterval);

    if (levelSelect.value === "1" && metinlerDizisi.length > 0) {
        metin1 = metinlerDizisi[0];
        başlık.textContent = başlıkListesi[0]; // Başlığı güncelle
    } else if (levelSelect.value === "2" && metinlerDizisi.length > 1) {
        metin1 = metinlerDizisi[1];
        başlık.textContent = başlıkListesi[1];
    } else if (levelSelect.value === "3" && metinlerDizisi.length > 2) {
        metin1 = metinlerDizisi[2];
        başlık.textContent = başlıkListesi[2];
    } else {
        console.error('Metin veya başlık bulunamadı veya yetersiz');
        return;
    }

    metin.textContent = metin1; // Metin içeriğini güncelle
    startTimer();
    kelimeSayisi = kelimeSay();
}

async function saveScore(score) {
    const isLoggedIn = await checkLoginStatus();
    if (isLoggedIn) {
        try {
            const response = await fetch('/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ score })
            });
            if (response.ok) {
                alert('Skor kaydedildi');
            } else {
                const errorText = await response.text();
                alert(`Skor kaydedilirken hata oluştu: ${errorText}`);
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    }
};

function startTimer() {
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = seconds + " saniye";
        saveExerciseCount();
    }, 1000);
}

function endTimer() {
    süre = parseInt(timerElement.textContent.split(" ")[0]); // Saniye cinsinden süreyi al
    clearInterval(timerInterval);
    console.log("Egzersiz süresi: " + süre + " saniye");
    sonYazılar();
    if (süre > highScore) {
        highScore = süre;
        saveScore(highScore);
    }
    
}

function kelimeSay() {
    let metinIcerik = metin.textContent.trim();
    return metinIcerik.split(/\s+/).length;
}

function sonYazılar() {
    sonyazı.textContent = kelimeSayisi + " kelimeyi " + süre + " saniyede okudunuz";
}

startButton.addEventListener("click", function() {
    fetchTexts().then(() => {
        metinGöster();
        
    });
});

async function fetchTexts() {
    try {
        const response = await fetch('/fetch-texts');
        const response2 = await fetch('/fetch-text-titles');
        const texts = await response.json();
        const titles = await response2.json();

        if (texts.length === 0 || titles.length === 0) {
            console.error('Metin veya başlık bulunamadı veya yetersiz');
            return;
        }

        metinlerDizisi = texts.map(item => item.metinler[0].metin);
        başlıkListesi = titles.map(item => item.metinler[0].başlık);

        console.log("Metinler alındı:", metinlerDizisi);
        console.log("Başlıklar alındı:", başlıkListesi);

        // Metinleri ve başlıkları aldıktan sonra gösterimi başlat
        metinGöster();
    } catch (error) {
        console.error('Metin ve başlıklar alınırken hata oluştu:', error);
    }
}

egzersizBitir.addEventListener("click", function () {
    endTimer();
    saveExerciseCount();
    
});

async function checkLoginStatus() {
    try {
        const response = await fetch('/status');
        const data = await response.json();
        if (data.loggedIn) {
            document.getElementById('giriştuş').innerText = "Profil";
            document.getElementById('giriştuş').href = "/profil";
            document.getElementById('logout').style.display = "block";
            document.querySelector('.showUserName').innerText = data.username + " profil sayfana hoşgeldin";
            document.querySelector('.highScore').innerText = "En yüksek skorun: " + data.score;
            return true;
        } else {
            document.getElementById('giriştuş').innerText = "Kullanıcı giriş";
            document.getElementById('giriştuş').href = "/authpage";
            document.getElementById('logout').style.display = "none";
            return false;
        }
    } catch (error) {
        console.error('Giriş durumu alınırken hata oluştu:', error);
        return false;
    }
}

async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            window.location.href = '/'; // Logout sonrası ana sayfaya yönlendirme
        } else {
            console.error('Logout başarısız');
        }
    } catch (error) {
        console.error('Logout sırasında hata:', error);
    }
}


async function saveExerciseCount() {
    const exerciseData = {
        egzersiz: "Hızlı okuma ", // Or any identifier for your game/exercise
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