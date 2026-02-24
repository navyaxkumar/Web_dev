const form = document.querySelector('#form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchCity= city.value;
    console.log(searchCity);
    const apiKey = 'cb9b20f45fc5db36cbc48f495e29a9fd';
    const sirkiapikey='0133cc5316757ac730cc46ae342334e4';
    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${sirkiapikey}`)
    const data = await response.json();
    console.log("City:",data.name);
    console.log("Temperature:",(data.main.temp-273).toFixed(1),"°C");
    console.log("Weather:",data.weather[0].main);
    console.log("Humidity:",data.main.humidity);
    console.log("Wind Speed:",data.wind.speed, "m/s");


})