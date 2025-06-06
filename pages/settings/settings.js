const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "../../index.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../../index.html";
});

document.getElementById("currentName").value = currentUser.name;
document.getElementById("currentEmail").value = currentUser.email;
document.getElementById("currentCep").value = currentUser.cep || "";
document.getElementById("currentStreet").value = currentUser.street || "";
document.getElementById("currentNeighborhood").value =
  currentUser.neighborhood || "";
document.getElementById("currentCity").value = currentUser.city || "";

async function fetchAddressFromCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
    const data = await response.json();

    if (data.erro) {
      alert("CEP não encontrado!");
      return null;
    }

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
    };
  } catch (error) {
    alert("Erro ao buscar CEP. Tente novamente mais tarde.");
    return null;
  }
}

document.getElementById("cep").addEventListener("input", async function (e) {
  const cep = e.target.value.replace(/\D/g, "");

  const streetField = document.getElementById("street");
  const neighborhoodField = document.getElementById("neighborhood");
  const cityField = document.getElementById("city");

  if (cep.length === 8) {
    const address = await fetchAddressFromCEP(cep);
    if (address) {
      streetField.value = address.street;
      neighborhoodField.value = address.neighborhood;
      cityField.value = address.city;
    }
  } else {
    streetField.value = "";
    neighborhoodField.value = "";
    cityField.value = "";
  }
});

document.getElementById("settingsForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Função para mostrar mensagem de erro abaixo do input
  function showError(input, message) {
    let errorSpan = input.parentElement.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  // Função para limpar mensagem de erro
  function clearError(input) {
    let errorSpan = input.parentElement.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = "";
    }
  }

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const cepInput = document.getElementById("cep");
  const streetInput = document.getElementById("street");
  const neighborhoodInput = document.getElementById("neighborhood");
  const cityInput = document.getElementById("city");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const cep = cepInput.value.trim();

  let valid = true;

  // Valida nome
  if (!name) {
    showError(nameInput, "Campo obrigatório");
    valid = false;
  } else {
    clearError(nameInput);
  }

  // Valida email simples (não obrigatório validar formato aqui, só presença)
  if (!email) {
    showError(emailInput, "Campo obrigatório");
    valid = false;
  } else {
    clearError(emailInput);
  }

  // Valida CEP
  if (!cep) {
    showError(cepInput, "Campo obrigatório");
    valid = false;
  } else {
    clearError(cepInput);
  }

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.id === currentUser.id);

  if (userIndex !== -1) {
    const updatedUser = {
      ...users[userIndex],
      name,
      email,
      cep,
      street: streetInput.value,
      neighborhood: neighborhoodInput.value,
      city: cityInput.value,
    };

    users[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    document.getElementById("currentName").value = name;
    document.getElementById("currentEmail").value = email;
    document.getElementById("currentCep").value = cep;
    document.getElementById("currentStreet").value = streetInput.value;
    document.getElementById("currentNeighborhood").value = neighborhoodInput.value;
    document.getElementById("currentCity").value = cityInput.value;

    this.reset();

    alert("Configurações atualizadas com sucesso!");
  }
});


document
  .getElementById("passwordForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Função para mostrar mensagem de erro abaixo do input
    function showError(input, message) {
      let errorSpan = input.parentElement.querySelector(".error-message");
      if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = "error-message";
        input.parentElement.appendChild(errorSpan);
      }
      errorSpan.textContent = message;
    }

    // Função para limpar mensagem de erro
    function clearError(input) {
      const errorSpan = input.parentElement.querySelector(".error-message");
      if (errorSpan) {
        errorSpan.textContent = "";
      }
    }

    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const currentPassword = currentPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    let valid = true;

    // Valida campos vazios
    if (!currentPassword) {
      showError(currentPasswordInput, "Campo obrigatório");
      valid = false;
    } else {
      clearError(currentPasswordInput);
    }

    if (!newPassword) {
      showError(newPasswordInput, "Campo obrigatório");
      valid = false;
    } else {
      clearError(newPasswordInput);
    }

    if (!confirmPassword) {
      showError(confirmPasswordInput, "Campo obrigatório");
      valid = false;
    } else {
      clearError(confirmPasswordInput);
    }

    if (!valid) return; // Sai se algum campo obrigatório estiver vazio

    // Verifica senha atual correta
    if (currentPassword !== currentUser.password) {
      alert("Senha atual incorreta!");
      return;
    }

    // Verifica se novas senhas coincidem
    if (newPassword !== confirmPassword) {
      alert("As novas senhas não coincidem!");
      return;
    }

    // Atualiza senha no localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.id === currentUser.id);

    if (userIndex !== -1) {
      const updatedUser = {
        ...users[userIndex],
        password: newPassword,
      };

      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      alert("Senha alterada com sucesso!");
      this.reset();

      // Limpa mensagens de erro após reset
      clearError(currentPasswordInput);
      clearError(newPasswordInput);
      clearError(confirmPasswordInput);
    }
  });

