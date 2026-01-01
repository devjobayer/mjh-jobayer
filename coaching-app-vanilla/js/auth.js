document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(e) {
    e.preventDefault();

    const role = document.getElementById('login-role').value;
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Mock validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Mock redirection based on role
    // In a real app, this would involve a backend token exchange
    console.log(`Logging in as ${role}...`);

    let targetUrl = '';

    switch (role) {
        case 'super-admin':
            targetUrl = 'super-admin.html';
            break;
        case 'teacher':
            targetUrl = 'teacher-dashboard.html';
            break;
        case 'student':
            targetUrl = 'student-dashboard.html';
            break;
        default:
            alert('Invalid Role');
            return;
    }

    // Simulate loading
    const submitBtn = document.querySelector('.btn-login');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Signing in...';
    submitBtn.disabled = true;

    setTimeout(() => {
        window.location.href = targetUrl;
    }, 1000);
}
