const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`FindMyStay Main Website on http://localhost:${PORT}`));
