const searchBtn = document.querySelector('#search-btn')
const city = document.querySelector('.city')
const cityName = document.querySelector('#city-name')
const tem = document.querySelector('#temperature')
const displayTable = document.querySelector('#table')

const getCity = async (city) => {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
  const data = await res.json()
  return data.results[0] //get first city result
}

const getWeather = async (latitude, longitude) => {
  const res = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
  const data = await res.json()
  return data
}

const builtHTML = async (cityInput) => {
  const cityData = await getCity(cityInput) 
  const weatherData = await getWeather(cityData.latitude, cityData.longitude)
  const dayNight = weatherData.current.is_day
  
  cityName.innerHTML = `${cityData.name}`
  tem.innerHTML = `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`
  let tableHtml = `
    <tr>
      <th>Country</th>
      <td>${cityData.country}</td>
    </tr>
    <tr>
      <th>Timezone</th>
      <td>${cityData.timezone}</td>
    </tr>
    <tr>
      <th>population</th>
      <td>${cityData.population}</td>
    </tr>
    <tr>
      <th>Tomorrow's Forecast</th>
      <td>Max: ${weatherData.daily.temperature_2m_max} ${weatherData.daily_units.temperature_2m_max} 
        </br>
        Low: ${weatherData.daily.temperature_2m_min} ${weatherData.daily_units.temperature_2m_min}
      </td>
    </tr>
    `
  displayTable.innerHTML = tableHtml
  
  if (dayNight) {
    city.classList.add('day');
    city.classList.remove('night');
  } else {
    city.classList.add('night');
    city.classList.remove('day');
  } 
}

searchBtn.addEventListener('click', () => {
  const searchValue = document.querySelector('#search-city').value
  builtHTML(searchValue)
})

