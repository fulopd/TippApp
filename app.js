const express = require('express');
const app = express();
const port = 3999;

app.use(express.static('public'));

app.listen(port, () => console.log(`Server listen on ${port} port.`));
