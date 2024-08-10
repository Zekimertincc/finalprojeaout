const kelimeGoster = document.querySelector('.kelime1');
const cevapInput = document.querySelector('.cevap');
const kontrolBtn = document.querySelector('.kontrol');
const baslatBtn = document.querySelector('#bas');
const dışKutu = document.querySelector('.kelime');
const levelSelect= document.getElementById("level")
const kelimeler = [
    "taş", "su", "dağ", "yol", "ev", "ay", "kış", "gün", "ağaç", "kuş", 
    "deniz", "yaz", "ışık", "kum", "yaprak", "rüzgar", "köy", "şehir", 
    "hava", "yıldız", "göl", "dal", "ot", "gölge", "buz"
];

let currentKelimeIndex;
let timer;
let intervalTime = 500 ;
let hız = 500;


function kelimeGosterRandom() {
    
    const randomIndex = Math.floor(Math.random() * kelimeler.length);
    currentKelimeIndex = randomIndex;
    kelimeGoster.textContent = kelimeler[randomIndex];
    setTimeout(() => {
        kelimeGoster.textContent = ""; // Önce temizle
    }, hız); // 500ms sonra kelimeyi göster
}

function yanıpsöndür(callback) {
    let count = 0;

    const interval = setInterval(() => {
        dışKutu.style.border = "5px solid RGB(74, 207, 238)";
        setTimeout(() => {
            dışKutu.style.border = "none";
        }, 200);
        count++;
        if (count >= 5) {
            clearInterval(interval);
            if (callback) callback();
            // Loop bittikten sonra callback fonksiyonunu çağır
        }
    }, 700);
    
    
}

function kontrolEt() {
    const girilenCevap = cevapInput.value.trim().toLowerCase();
    const dogruCevap = kelimeler[currentKelimeIndex];

    if (girilenCevap === dogruCevap) {
        alert("Tebrikler, doğru cevap!");
        baslatOyun();
    } else {
        alert("Maalesef, yanlış cevap!");
    }
}


function baslatOyun() {

if (levelSelect.value === "1") {
    hız = 500;
} else if (levelSelect.value === "2") {
    hız = 300;
} else if (levelSelect.value === "3") {
    hız = 200;
}

    yanıpsöndür(kelimeGosterRandom);
}

kontrolBtn.addEventListener('click', kontrolEt);
baslatBtn.addEventListener('click', baslatOyun);
