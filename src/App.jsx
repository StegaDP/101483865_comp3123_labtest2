import { useState, useEffect } from 'react'
import './App.css'
import { countryCodeEmoji } from 'country-code-emoji';


function timestampsToDate(timestamp, offset = 0) {
    return {
        utc: new Date(timestamp * 1000),
        local: new Date((timestamp + offset) * 1000)
    }


}


function Weather({ city, weather }) {
    console.log(weather);
    if (Object.keys(weather).length === 0) {
        return <p>Loading...</p>
    }

    if (weather.cod !== 200) {
        return <p>Error: {weather.message}</p>
    }

    const sunsetTime = timestampsToDate(weather.sys.sunset, weather.timezone);
    const sunriseTime = timestampsToDate(weather.sys.sunrise, weather.timezone);

    return (
        <>
            <p id="flag_city">City: {city} {countryCodeEmoji(weather.sys.country)}</p>
            {/*<p>{JSON.stringify(weather)}</p>*/}
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto"}}>
                <p>lon:</p>
                <p>{weather.coord.lon}</p>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto"}}>
                <p>lat:</p>
                <p>{weather.coord.lat}</p>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto", alignItems: "center"}}>
                <p>weather: </p>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt=""/>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto", alignItems: "center"}}>
                <p>temperature: </p>
                <p>{Math.round(weather.main.temp-273.15)}°C</p>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto", alignItems: "center"}}>
                <p>feels like: </p>
                <p>{Math.round(weather.main.feels_like-273.15)}°C</p>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto", alignItems: "center"}}>
                <p>pressure: </p>
                <p>{Math.round(weather.main.pressure)} hPa</p>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto", alignItems: "center"}}>
                <p>humidity: </p>
                <p>{Math.round(weather.main.humidity)}%</p>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto", alignItems: "center"}}>
                <p>sunrise(local): </p>
                <p>{sunriseTime.local.toISOString()}</p>
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "30%", margin: "auto", alignItems: "center"}}>
                <p>sunset(local): </p>
                <p>{sunsetTime.local.toISOString()}</p>
            </div>
        </>
    )
}


function App() {
    const [city, setCity] = useState("Toronto");
    const [queryCity, setQueryCity] = useState("Toronto");
    const [weather, setWeather] = useState({});

    useEffect(() => {
        const timeout = setTimeout(() => {
            setQueryCity(city);
        }, 500);

        return () => clearTimeout(timeout);
    }, [city]);

    useEffect(() => {
        async function fetchWeather() {
            if (!queryCity) return;

            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=763230383ea4a1a43fe599d1f1636b98`
                );
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.log(error);
                setWeather({});
            }
        }

        fetchWeather();
    }, [queryCity]);

  return (
    <div style={{width: "100%"}}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)}/>
        <Weather weather={weather} city={city}/>
    </div>
  )
}

export default App
