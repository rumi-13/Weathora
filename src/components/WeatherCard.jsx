import React, { useEffect, useRef, useState } from "react";
import { Search, Wind, Droplets, ThermometerSun, Compass, ArrowRight } from "lucide-react";

function WeatherCard() {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const inpRef = useRef(null);

  const fetchWeather = async () => {
    const API_KEY = "decc889dc16d764cdc4322fd7b5db42b";
    const CITY = inpRef.current.value;
    
    if (!CITY.trim()) {
      alert("Please enter a city name");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      // Check if the API returned an error
      if (data.cod !== 200) {
        alert(data.message); // e.g., "city not found"
        setWeather({});      // reset state
      } else {
        setWeather(data);    // update state with valid data
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Fetch error:", error);
      setWeather({});
    } finally {
      setLoading(false);
    }
  };

  function handleClick() {
    fetchWeather();
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  }

  // Get appropriate background based on weather condition
  const getWeatherBackground = () => {
    if (!weather.weather) return "bg-gradient-to-br from-blue-500 to-blue-700";
    
    const condition = weather.weather[0]?.main?.toLowerCase();
    
    if (condition?.includes("clear")) return "bg-gradient-to-br from-yellow-400 to-orange-500";
    if (condition?.includes("cloud")) return "bg-gradient-to-br from-gray-300 to-gray-500";
    if (condition?.includes("rain") || condition?.includes("drizzle")) return "bg-gradient-to-br from-blue-400 to-blue-600";
    if (condition?.includes("thunderstorm")) return "bg-gradient-to-br from-gray-700 to-gray-900";
    if (condition?.includes("snow")) return "bg-gradient-to-br from-blue-100 to-blue-300";
    if (condition?.includes("mist") || condition?.includes("fog")) return "bg-gradient-to-br from-gray-300 to-gray-400";
    
    return "bg-gradient-to-br from-blue-500 to-blue-700";
  };

  // Format wind direction to cardinal directions
  const getWindDirection = (deg) => {
    if (deg === undefined) return "-";
    
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-10">
    <div className="flex justify-center items-center h-fit rounded-2xl bg-slate-950">
      <div className="w-96 rounded-2xl overflow-hidden shadow-2xl bg-slate-950">
        {/* Search section */}
        <div className="p-5 bg-slate-950 border-b border-gray-200">
          <div className="relative">
            <input
              type="text" 
              placeholder="Enter city name..."
              ref={inpRef}
              onKeyPress={handleKeyPress}
              className="w-full pl-4 pr-12 py-3 bg-white  rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
            />
            <button
              className="absolute right-2 top-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Weather display section */}
        <div className={`p-6 text-black transition-all duration-500 ${getWeatherBackground()}` }>
          {weather.main ? (
            <div className="flex flex-col">
              {/* Location and main temp */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {weather.name}
                    <span className="text-lg ml-1 opacity-90">
                      {weather.sys?.country && `, ${weather.sys.country}`}
                    </span>
                  </h2>
                  <p className="text-sm mt-1 opacity-90">
                    {new Date().toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
                  <div className="text-sm opacity-90">
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>
              </div>

              {/* Weather condition with icon */}
              <div className="flex items-center mb-6">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                  alt="Weather icon"
                  className="w-20 h-20 mr-2"
                />
                <div>
                  <div className="text-xl font-semibold">{weather.weather?.[0]?.main}</div>
                  <div className="text-sm capitalize opacity-90">{weather.weather?.[0]?.description}</div>
                </div>
              </div>

              {/* Weather details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-90 rounded-lg p-3 flex items-center">
                  <ThermometerSun size={20} className="mr-2" />
                  <div>
                    <div className="text-sm opacity-80">Min / Max</div>
                    <div>{Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°</div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-3 flex items-center">
                  <Droplets size={20} className="mr-2" />
                  <div>
                    <div className="text-sm opacity-80">Humidity</div>
                    <div>{weather.main.humidity}%</div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-3 flex items-center">
                  <Wind size={20} className="mr-2" />
                  <div>
                    <div className="text-sm opacity-80">Wind Speed</div>
                    <div>{weather.wind?.speed} m/s</div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-80 rounded-lg p-3 flex items-center">
                  <Compass size={20} className="mr-2" />
                  <div>
                    <div className="text-sm opacity-80">Wind Direction</div>
                    <div>{getWindDirection(weather.wind?.deg)} ({weather.wind?.deg}°)</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <img 
                src="/api/placeholder/100/100" 
                alt="Weather" 
                className="mb-4 opacity-70"
              />
              <p className="text-lg font-medium">Enter a city to see the weather</p>
              <p className="text-sm opacity-80 mt-2">
                Search for any location to get current weather information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    
      <div>
        <h1 className="text-semibold text-black relative -bottom-40  ">Created Using OpenWeather API</h1>
      </div>
  </div>
  );
}

export default WeatherCard;