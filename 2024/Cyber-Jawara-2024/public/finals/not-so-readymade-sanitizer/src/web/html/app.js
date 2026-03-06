document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('password-form');
    const htmlPreviewer = document.getElementById('html-previewer');
    const passwordInput = document.getElementById('password-input');
    const submitPassword = document.getElementById('submit-password');
    const htmlInput = document.getElementById('html-input');
    const previewButton = document.getElementById('preview-button');

    let isPasswordValid = false;

    async function render(password, html) {
        try {
            let check = await fetch(`/search.php?${new URLSearchParams({validate: 1, password})}`).then((r) => r.status);
            
            if (check === 200) {
                isPasswordValid = true;
                passwordForm.style.display = 'none';
                htmlPreviewer.style.display = 'block';
                if (html) {
                    let sanitized = await fetch(`/sanitizer.php?${new URLSearchParams({html})}`).then((r) => r.text());
                    document.getElementById('preview').innerHTML = sanitized;
                }
            } else {
                throw new Error("Invalid password");
            }
        } catch (error) {
            isPasswordValid = false;
            passwordForm.style.display = 'block';
            htmlPreviewer.style.display = 'none';
            alert("Password is incorrect or an error occurred");
        }
    }

    // Check if password and html are provided in the URL
    let [password, html] = new URLSearchParams(location.search);
    if (password && html) {
        passwordInput.value = password[1];
        htmlInput.value = decodeURIComponent(html[1]);
        render(password[1], html[1]);
    }

    submitPassword.addEventListener('click', () => {
        const password = passwordInput.value;
        render(password, '');
    });

    previewButton.addEventListener('click', () => {
        if (!isPasswordValid) {
            alert("Please enter a valid password first.");
            return;
        }
        const password = passwordInput.value;
        const html = htmlInput.value;
        
        // Update URL with current password and HTML
        const newUrl = `${window.location.pathname}?${new URLSearchParams({password, html: encodeURIComponent(html)})}`;
        history.pushState(null, '', newUrl);

        render(password, html);
    });
});