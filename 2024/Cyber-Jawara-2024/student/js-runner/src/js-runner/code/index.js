const express = require('express');
const { VM } = require('vm2');
const util = require('util');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('public'))

app.post('/run', (req, res) => {
    const userCode = req.body.code;
    
    if (typeof userCode !== 'string') {
        return res.status(400).json({ error: 'Invalid code format' });
    }

    try {
        const vm = new VM({
            timeout: 5000,
            eval: false,
            wasm: false,
        });

        const result = vm.run(userCode);
        res.json({
            result: result
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
