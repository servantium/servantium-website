// Email Copy to Clipboard
function copyEmail(event) {
    const email = 'hello@servantium.com';
    const chip = event ? event.currentTarget : document.getElementById('email-chip');
    const text = chip.querySelector('.email-chip-text');
    const icon = chip.querySelector('.email-chip-icon');

    navigator.clipboard.writeText(email).then(function() {
        // Update to copied state
        chip.classList.add('copied');
        text.textContent = 'Copied!';
        icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';

        // Reset after 2 seconds
        setTimeout(function() {
            chip.classList.remove('copied');
            text.textContent = email;
            icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
        }, 2000);
    }).catch(function(err) {
        // Fallback: open mailto
        window.location.href = 'mailto:' + email;
    });
}

// Footer Email Copy
function copyFooterEmail(btn) {
    const email = 'hello@servantium.com';
    const text = btn.querySelector('.footer-email-chip-text');
    const icon = btn.querySelector('.footer-email-chip-icon');
    navigator.clipboard.writeText(email).then(function() {
        btn.classList.add('copied');
        text.textContent = 'Copied!';
        icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        setTimeout(function() {
            btn.classList.remove('copied');
            text.textContent = email;
            icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
        }, 2000);
    }).catch(function() {
        window.location.href = 'mailto:' + email;
    });
}
