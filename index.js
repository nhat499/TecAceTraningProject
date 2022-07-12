const express = require('express');
const app = express();
const ejs = require('ejs');


const view = require('./routes/view.js');
const edit = require('./routes/edit.js');
const build = require('./routes/build.js');
const remove = require('./routes/remove.js');


app.get('/test', (req, res) => {
    res.send('test works');
  });

app.get('/', (req,res) => {
    ejs.renderFile('index.html', {},{}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.send(template);
        }
    });
})

app.use('/view', view);
app.use('/edit', edit);
app.use('/build', build);
app.use('/remove', remove);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});