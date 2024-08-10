app.post('/save',  async (req, res) => {
    try {
        const newScore = new Score({
            userId: req.user._id,
            score: req.body.score
        });
        await newScore.save();
        res.status(200).send('Score saved');
    } catch (err) {
        res.status(500).send('Server error');
    }
});
