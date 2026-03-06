<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Readymade HTML Sanitizers</title>
    <link rel="stylesheet" href="./style.css">
    
</head>

<body>
    <div id="root">
        <div class="App">
            <h1 id="title">Readymade HTML Sanitizers</h1>
            <textarea id="editor" oninput="location.hash=this.value;render()" placeholder="Enter Message..."></textarea>
            <iframe id="preview">
            </iframe>
        </div>
    </div>

    <script src="./sanitizer.js"></script>

    <script>
        window.addEventListener('DOMContentLoaded', async (e) => {
            let html = '<center><img src="/readymade.png" width="300px" height="300px"></center>'
            try {
                if(!location.hash.substr(1)){
                    editor.value = html
                    location.hash = html
                }else{
                    editor.value = decodeURIComponent(location.hash.substr(1))
                }
                render()
            } catch (error) {
                editor.value = html
                document.getElementById('preview').srcdoc = html;
                return;
            }
        })

        async function render() {
            let html = location.hash.substr(1)
            let sanitized = (await(fetch('/sanitizer.php', {method: "POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body: `html=${html}`}).then((r)=>r.text())));
            document.getElementById('preview').srcdoc = `${sanitizeHTMLAgain(sanitized)}`
        }

        window.onhashchange = render
    </script>
</body>
</html>