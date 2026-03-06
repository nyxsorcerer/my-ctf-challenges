import express from 'express'
import fs from 'fs'

import { randomBytes } from 'crypto';

const index = fs.readFileSync("./html/index.html").toString();
const app = express();
const port = 8001

app.use(express.static('static'));

app.get('/', function(req, res){
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.send(index.replace(/{{nonce}}/g, randomBytes(16).toString('hex')));
});

app.listen(port, async () => {
    console.log(`[*] Webapp Listening on port ${port}`)
})

