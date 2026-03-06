document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const runButton = document.getElementById('runButton');
    const outputDiv = document.getElementById('output');

    runButton.addEventListener('click', async () => {
        const code = codeInput.value;
        runButton.disabled = true;
        runButton.textContent = 'Running...';
        outputDiv.innerHTML = '<p>Executing code...</p>';

        try {
            const response = await fetch('/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            outputDiv.innerHTML = `
                <h3>Result:</h3>
                <pre>${escapeHtml(String(data.result))}</pre>
            `;
        } catch (error) {
            outputDiv.innerHTML = `
                <h3>Error:</h3>
                <pre>${escapeHtml(error.message)}</pre>
                ${error.stack ? `<h3>Stack Trace:</h3><pre>${escapeHtml(error.stack)}</pre>` : ''}
            `;
        } finally {
            runButton.disabled = false;
            runButton.textContent = 'Run Code';
        }
    });

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});

// Example usage (this will be executed when you run the Node.js code)
const exampleCode = `
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(10);
`;