document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    function checkField(id, message) {
        const field = document.getElementById(id);
        const errorSpan = field.parentElement.querySelector('.error-message');
        const value = field.value.trim();

        if (!value) {
            errorSpan.textContent = message;
            isValid = false;
        } else {
            errorSpan.textContent = '';
        }
    }

    checkField('name', 'Campo obrigatório');
    checkField('email', 'Campo obrigatório');
    checkField('cep', 'Campo obrigatório');
    checkField('password', 'Campo obrigatório');
    checkField('confirmPassword', 'Campo obrigatório');

    if (!isValid) return;

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    const email = document.getElementById('email').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        alert('Este email já está cadastrado!');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: document.getElementById('name').value.trim(),
        email,
        password,
        cep: document.getElementById('cep').value.trim(),
        street: document.getElementById('street').value,
        neighborhood: document.getElementById('neighborhood').value,
        city: document.getElementById('city').value,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    window.location.href = '../../index.html';
});

document.getElementById('cep').addEventListener('blur', async function(e) {
    const cep = e.target.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado!');
            return;
        }

        document.getElementById('street').value = data.logradouro;
        document.getElementById('neighborhood').value = data.bairro;
        document.getElementById('city').value = data.localidade;
    } catch (error) {
        alert('Erro ao buscar CEP. Tente novamente mais tarde.');
    }
});
