
async function fetchUsersEgzersizCount() {
    try {
        const response = await fetch('/users-egzersiz-count');
        const data = await response.json();

        const listElement = document.getElementById('users-scores-list');
        listElement.innerHTML = ''; // Mevcut listeyi temizliyoruz

        data.forEach(user => {
            const row = document.createElement('tr');
            const usernameCell = document.createElement('td');
            const egzersizCell = document.createElement('td');

            usernameCell.textContent = user.username;

            if (user.egzersizler.length > 0) {
                const egzersizList = user.egzersizler.map(egz => `${egz.egzersiz}: ${egz.count}`).join(', ');
                egzersizCell.textContent = egzersizList;
            } else {
                egzersizCell.textContent = 'Henüz egzersiz yapılmamış';
            }

            row.appendChild(usernameCell);
            row.appendChild(egzersizCell);
            listElement.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users and egzersiz counts:', error);
    }
}

/*
async function fetchScore() {
    try {
        const response = await fetch('/users-scores');
        const data = await response.json();

        const listElement = document.getElementById('user-scores');
        listElement.innerHTML = ''; // Mevcut listeyi temizliyoruz

        data.forEach(user => {
            const row = document.createElement('tr');
            const usernameCell = document.createElement('td');
            const scoreCell = document.createElement('td');

            usernameCell.textContent = user.username;
            scoreCell.textContent = user.score;

            row.appendChild(usernameCell);
            row.appendChild(scoreCell);
            listElement.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching score:', error);
    }
    
}
*/

async function fetchScore() {
    try {
        const response = await fetch('/users-scores');
        const data = await response.json();

        const listElement = document.getElementById('user-scores');
        listElement.innerHTML = ''; // Mevcut listeyi temizliyoruz

        data.forEach(user => {
            const row = document.createElement('tr');
            const usernameCell = document.createElement('td');
            const scoreCell = document.createElement('td');

            usernameCell.textContent = user.username;
            scoreCell.textContent = user.scores.length > 0 ? user.scores.join(', ') : 'Henüz skor yok';

            row.appendChild(usernameCell);
            row.appendChild(scoreCell);
            listElement.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching score:', error);
    }
}

window.onload = function() {
    fetchScore(); // Skor tablosu için fetch
    fetchUsersEgzersizCount(); // Egzersiz sayıları için fetch
};
