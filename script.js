document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const inputs = this.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('invalid'));
    const errorSpans = this.querySelectorAll('.error-message');
    errorSpans.forEach(span => span.textContent = '');

    let isValid = true;

    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');

    if (!emailEl.value.trim()) {
        emailEl.classList.add('invalid');
        emailEl.parentElement.querySelector('.error-message').textContent = 'Email é obrigatório.';
        isValid = false;
    }

    if (!passwordEl.value.trim()) {
        passwordEl.classList.add('invalid');
        passwordEl.parentElement.querySelector('.error-message').textContent = 'Senha é obrigatória.';
        isValid = false;
    }

    if (!isValid) return;

    const email = emailEl.value.trim();
    const password = passwordEl.value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'pages/home/home.html';
    } else {
        alert('Email ou senha incorretos!');
    }
});
