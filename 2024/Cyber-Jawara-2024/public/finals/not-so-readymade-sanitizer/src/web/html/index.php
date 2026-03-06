<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Previewer SPA</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        #app {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        #password-form {
            display: block;
        }
        #html-previewer {
            display: none;
        }
        textarea {
            width: 100%;
            height: 150px;
            margin-bottom: 10px;
        }
        #preview {
            border: 1px solid #ccc;
            padding: 10px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div id="app">
        <div id="password-form">
            <h2>Enter Password</h2>
            <input type="password" id="password-input" placeholder="Enter password">
            <button id="submit-password">Submit</button>
        </div>
        <div id="html-previewer">
            <h2>HTML Previewer</h2>
            <textarea id="html-input" placeholder="Enter your HTML here"></textarea>
            <button id="preview-button">Preview</button>
            <div id="preview"></div>
        </div>
    </div>
    <script src="app.js"></script>
</body>
</html>