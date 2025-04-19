export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

export async function getWeatherForecast(): Promise<DailyWeather | null> {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=48.14&longitude=11.58&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Europe%2FBerlin"
    );

    if (!res.ok) throw new Error("Weather API request failed");

    const data = await res.json();

    console.log("weathercode:", data.daily.weathercode);

    return data.daily;
  } catch (error) {
    console.error("Ошибка при получении погоды:", error);
    return null;
  }
}