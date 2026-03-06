import puppeteer from 'puppeteer'
import express from 'express'
import rateLimit from 'express-rate-limit'

const app = express()
app.use(express.static('static'))
app.use(express.json())
app.use(
    '/visit', rateLimit({
        windowMs: 3 * 60 * 1000, // 5 Minutes
        max: 5,
        message: { error: 'Too many requests, try again later' }
    })
)

const port = process.env.PORT || 8000
const APP_URL = process.env.APP_URL || 'http://app:3000/'
const FLAG = process.env.FLAG || "fakeflag"
const sleep = ms => new Promise(r => setTimeout(r, ms));

console.log(`FLAG: ${FLAG}`)
console.log(`URL: ${APP_URL}`)

async function visit(url) {
    let browser = await puppeteer.launch({
        // pipe: true,
        // dumpio: true,
        ignoreHTTPSErrors: true,
        acceptInsecureCerts: true,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-background-networking',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-gpu',
            '--disable-sync',
            '--disable-translate',
            '--hide-scrollbars',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-first-run',
            '--safebrowsing-disable-auto-update',
            '--disable-dev-shm-usage',
            '--incognito',
        ]
    })
    const ctx = await browser.createBrowserContext()
    const page = await ctx.newPage()
    try {
        await page.setCookie({
			name: 'flag',
			value: FLAG,
			domain: new URL(APP_URL).hostname,
            httponly: false
		});
        await page.goto(url, { timeout: 2 * 1000, waitUntil: 'networkidle2' })
        await sleep(10000)
    } catch (err){
        console.log(err);
    } finally {
        await page.close()
        await ctx.close()
        console.log(`Done visiting -> ${url}`)

    }

}

app.get('/visit', async (req, res) => {
    let {url} = req.query
    if(
        (typeof url !== 'string') || (url === undefined) ||
        (url === '') || (!url.startsWith('http'))
    ){
        return res.status(400).send({error: "Invalid url"})
    }
    
    try {
        console.log(`[*] Visiting -> ${url}`)
        visit(url)
        return res.sendStatus(200)
    } catch (e) {
        console.error(`[-] Error visiting -> ${url}: ${e.message}`)
        return res.status(400).send({ error: e.message })
    }
})

app.listen(port, async () => {
    console.log(`[*] Listening on port ${port}`)
})