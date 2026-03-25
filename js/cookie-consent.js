(function() {
    var consent = localStorage.getItem('servantium_cookie_consent');
    if (!consent) {
        document.getElementById('cookie-consent').style.display = 'block';
        document.body.style.paddingBottom = '80px';
    }
})();
function acceptCookies() {
    localStorage.setItem('servantium_cookie_consent', 'accepted');
    document.getElementById('cookie-consent').style.display = 'none';
    document.body.style.paddingBottom = '';
    // Load GA4 after acceptance
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6EFX4FNH6H';
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-6EFX4FNH6H');
}
function declineCookies() {
    localStorage.setItem('servantium_cookie_consent', 'declined');
    document.getElementById('cookie-consent').style.display = 'none';
    document.body.style.paddingBottom = '';
}
