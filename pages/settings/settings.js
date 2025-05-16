// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = '../login/login.html';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../login/login.html';
});

// Load current user data in disabled fields
document.getElementById('currentName').value = currentUser.name;
document.getElementById('currentEmail').value = currentUser.email;
document.getElementById('currentCep').value = currentUser.cep || '';
document.getElementById('currentStreet').value = currentUser.street || '';
document.getElementById('currentNeighborhood').value = currentUser.neighborhood || '';
document.getElementById('currentCity').value = currentUser.city || '';

// CEP API Integration
async function fetchAddressFromCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado!');
            return null;
        }
        
        return {
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade
        };
    } catch (error) {
        alert('Erro ao buscar CEP. Tente novamente mais tarde.');
        return null;
    }
}

document.getElementById('cep').addEventListener('input', async function(e) {
    const cep = e.target.value.replace(/\D/g, '');

    // Referência dos campos
    const streetField = document.getElementById('street');
    const neighborhoodField = document.getElementById('neighborhood');
    const cityField = document.getElementById('city');

    if (cep.length === 8) {
        const address = await fetchAddressFromCEP(cep);
        if (address) {
            streetField.value = address.street;
            neighborhoodField.value = address.neighborhood;
            cityField.value = address.city;
        }
    } else {
        // Limpa os campos se o CEP for menor que 8 dígitos
        streetField.value = '';
        neighborhoodField.value = '';
        cityField.value = '';
    }
});

// Settings form
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cep = document.getElementById('cep').value;
    const street = document.getElementById('street').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const city = document.getElementById('city').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        const updatedUser = {
            ...users[userIndex],
            name,
            email,
            cep,
            street,
            neighborhood,
            city
        };
        
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        document.getElementById('currentName').value = name;
        document.getElementById('currentEmail').value = email;
        document.getElementById('currentCep').value = cep;
        document.getElementById('currentStreet').value = street;
        document.getElementById('currentNeighborhood').value = neighborhood;
        document.getElementById('currentCity').value = city;
        
        this.reset();
        
        alert('Configurações atualizadas com sucesso!');
    }
});

document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (currentPassword !== currentUser.password) {
        alert('Senha atual incorreta!');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('As novas senhas não coincidem!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        const updatedUser = {
            ...users[userIndex],
            password: newPassword
        };
        
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        alert('Senha alterada com sucesso!');
        this.reset();
    }
});