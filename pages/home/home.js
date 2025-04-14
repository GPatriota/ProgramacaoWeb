const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = '../login/login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../login/login.html';
});

const modal = document.getElementById('weatherModal');
const weatherBtn = document.getElementById('weatherBtn');
const closeBtn = document.getElementsByClassName('close')[0];

weatherBtn.onclick = async function () {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=77edd1c87a954853b7e15314251404&q=${currentUser.city}&days=1&lang=pt`);
        const data = await response.json();

        const weatherInfo = document.getElementById('weatherInfo');
        weatherInfo.innerHTML = `
            <p><strong>Na cidade que você mora, de acordo com os dados de seu cadastro: </strong> ${data.location.name}</p>
            <p><strong>Seguem abaixo as principais informações da previsão do tempo da cidade. </strong> </p>
            <p><strong>Temperatura máxima:</strong> ${data.forecast.forecastday[0].day.maxtemp_c}°C</p>
            <p><strong>Temperatura mínima:</strong> ${data.forecast.forecastday[0].day.mintemp_c}°C</p>
            <p><strong>Temperatura atual:</strong> ${data.current.temp_c}°C</p>
            <p><strong>Provável clima:</strong> ${data.current.condition.text}</p>
        `;

        modal.style.display = 'block';
    } catch (error) {
        alert('Erro ao buscar previsão do tempo. Tente novamente mais tarde.');
    }
};

closeBtn.onclick = function () {
    modal.style.display = 'none';
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};