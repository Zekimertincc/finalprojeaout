const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { connectDb, collection, collection2 , collection3} = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());






// Connect to database
connectDb();

app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Route definitions
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/acilandikey', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/acılandikey.html'));
});

app.get('/acilanyatay', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/acılanyatay.html'));
});

app.get('/benzerkelimeler', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/benzerkelimeler.html'));
});

app.get('/blokokuma', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/blokokuma.html'));
});

app.get('/buyuyend', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/büyüyendaire.html'));
});

app.get('/buyuyenk', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/büyüyenkare.html'));
});

app.get('/buyuyendi', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/büyüyendikdört.html'));
});

app.get('/hizli', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/hızlıokuma.html'));
});

app.get('/kolonlar', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/kolonlar.html'));
});

app.get('/authpage', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/authpage.html'));
});

app.get('/profil', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/profil.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/admin.html'));
});

app.get('/golge', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/golge.html'));
});

app.get('/takis', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/takis.html'));
});

app.get('/tekcift', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/deneme.html'));
});

app.get('/dikeyzik', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/dikeyzikzak.html'));
});

app.get('/cms', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/cms.html'));
});
app.get('/cms2', (req,res) => {
    res.sendFile(path.join(__dirname, '/views/cms2.html'));
});



// Register route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return res.status(400).send('This username is already taken.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = { username, password: hashedPassword };
        await collection.create(newUser);

        res.status(201).send('User registered successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during user registration.');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Please provide both username and password.');
    }

    try {
        const user = await collection.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password.');
        }

        // Create session
        req.session.user = { id: user._id, username: user.username };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login.');
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/');
    });
});

// Check login status route
app.get('/status', async (req, res) => {
    if (req.session.user) {
        try {
            const user = req.session.user;
            const highScoreDoc = await collection2.findOne({ userId: user.id }).sort({ score: -1 }).exec();
            const highScore = highScoreDoc ? highScoreDoc.score : 0;
            res.json({ loggedIn: true, username: user.username, score: highScore });
        } catch (error) {
            console.error('Error fetching high score:', error);
            res.json({ loggedIn: true, username: req.session.user.username, score: 0 });
        }
    } else {
        res.json({ loggedIn: false });
    }
});

// Score save route
app.post('/save', async (req, res) => {
    console.log('Saving score for user:', req.session.user.id);
    console.log('Score:', req.body.score);
    if (!req.session.user) {
        return res.status(401).send('Unauthorized: No session available');
    }

    try {
        const newScore = {
            userId: req.session.user.id,
            score: req.body.score
        };
        await collection2.create(newScore);
        res.status(200).send('Score saved');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// New route to fetch all users and their scores
app.get('/users-scores', async (req, res) => {
    try {
        const users = await collection.find({}, 'username').exec(); // Only fetch username
        const scores = await collection2.find({}).exec();

        const userScoresMap = {};

        scores.forEach(score => {
            const userIdStr = score.userId.toString();
            if (!userScoresMap[userIdStr]) {
                userScoresMap[userIdStr] = [];
            }
            userScoresMap[userIdStr].push(score.score);
        });

        const usersScores = users.map(user => {
            const userIdStr = user._id.toString();
            return {
                username: user.username,
                scores: userScoresMap[userIdStr] || []
            };
        });

        res.json(usersScores);
    } catch (error) {
        console.error('Error fetching users and scores:', error);
        res.status(500).send('Server error');
    }
});


// text kaydetme 
app.post('/saveText', async (req, res) => {
    const { başlık, metin } = req.body;
    try {
        const newText = new collection3({ metinler: [{ başlık, metin }] }); // collection3 olarak değiştirildi
        await newText.save();
        res.status(200).send('Text saved successfully!');
    } catch (error) {
        res.status(500).send('Error saving text: ' + error.message);
    }
});
// text fetch etme 
app.get('/fetch-texts', async (req, res) => {
    try {
      const texts = await collection3.find({}, {  'metinler.metin': 1 });
      res.json(texts);
    } catch (err) {
      console.error("Hata oluştu:", err);
      res.status(500).send('Sunucu hatası: ' + err.message);
    }
  });
  
// bütün textlerin başlıkları göster

app.get('/fetch-text-titles', async (req, res) => {
    try {
        const texts = await collection3.find({}, { 'metinler.başlık': 1 }); // Fetch only the titles
        const titles = texts.map(doc => doc.metinler.map(metin => metin.başlık)).flat(); // Extract titles
        res.json(titles);
    } catch (err) {
        console.error("Hata oluştu:", err);
        res.status(500).send('Sunucu hatası: ' + err.message);
    }
});
//text silme 
app.delete('/delete-text', async (req, res) => {
    const { başlık } = req.body;
    try {
        const result = await collection3.deleteOne({ 'metinler.başlık': başlık });
        if (result.deletedCount > 0) {
            res.status(200).send('Text deleted successfully');
        } else {
            res.status(404).send('Text not found');
        }
    } catch (error) {
        console.error('Error deleting text:', error);
        res.status(500).send('Server error');
    }
});

  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
