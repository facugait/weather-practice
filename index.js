const generateRandomNumber = (min, max) => {
  return Math.floor((Math.random() * 200) + 1);
}

const getCountry = async () => {
  const randomNumber = generateRandomNumber();

  const countryUrl = `https://restcountries-v1.p.rapidapi.com/callingcode/`;
  const options = {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
      "x-rapidapi-key": "72d45c924cmshcf3fd1ea3d32df0p17f916jsnf237c97b46ad"
    }
  }
  try {
    return await fetch(`${countryUrl}${randomNumber}`, options);
  }
  catch (err) {
    console.error('Country not found.', err);
  }

}

const getWeather = async () => {
  let dataLatLng = await getCountry();
  if (dataLatLng.status != 200) return;

  let countryLatLng = (await dataLatLng.json())[0];

  let lat = countryLatLng.latlng[0];
  let lng = countryLatLng.latlng[1];

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=8026610ae2b32945b0232109306342c0&units=metric`;

  try {
    let response = await fetchWithTimeout(weatherUrl, {}, 1000);
    let weather = await response.json();
    console.log(`Fisrt search\nCountry: ${weather.name}\nTemperature: ${weather.main.temp}°C`);
  }
  catch (err) {
    console.log('Country not found. Searching again.');

    //Second API
    const secondWeatherUrl = `http://api.weatherstack.com/current?access_key=33e52b628ca1c285db117c6bb9610560&query=${lat},${lng}&units=m`;

    try {
      let secondResponse = await fetch(secondWeatherUrl);
      let secondWeather = await secondResponse.json();
      console.log(`Second search\nCountry: ${secondWeather.location.country}\nTemperature: ${secondWeather.current.temperature}°C`);
    }
    catch (err) {
      console.log("Country not found.");
    }
  }
}

function fetchWithTimeout(url, options, timeout) {

  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Data not found.')), timeout)
    )
  ]);
}

setInterval(getWeather, 6000);
