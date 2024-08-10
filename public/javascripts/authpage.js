async function checkLoginStatus() {
    try {
        
        const response = await fetch('/status');
        const data = await response.json();
        if (data.loggedIn) {
            document.getElementById('giriştuş').innerText = "Profil";
            document.getElementById('giriştuş').href = "/profil";
            document.getElementById('logout').style.display = "block";
            document.querySelector('.showUserName').innerText = data.username + " " +"profil sayfana hoşgeldin";
            document.querySelector('.highScore').innerText = "En yüksek skorun: " + data.score;
        } else {
            document.getElementById('giriştuş').innerText = "Kullanıcı giriş";
            document.getElementById('giriştuş').href = "/authpage";
            document.getElementById('logout').style.display = "none";
        }
    } catch (error) {
        console.error('Error fetching login status:', error);
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
            window.location.href = '/'; // Redirect to home page after logout
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

 

window.onload = checkLoginStatus;