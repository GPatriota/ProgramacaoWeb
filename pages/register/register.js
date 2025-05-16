document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cep = document.getElementById('cep').value;
    const street = document.getElementById('street').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const city = document.getElementById('city').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(user => user.email === email)) {
        alert('Este email já está cadastrado!');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        cep,
        street,
        neighborhood,
        city,
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Cadastro realizado com sucesso!');
    window.location.href = '../login/login.html';
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