export function getWeatherIcon(code: number): string {
  if (code === 0) return "/icons/weather/sun.png"; // ясно
  if (code === 1) return "/icons/weather/sun_cloud.png"; // в основном ясно
  if ([2, 3].includes(code)) return "/icons/weather/cloud.png"; // облачно
  if ([45, 48].includes(code)) return "/icons/weather/fog.png";
  if ([51, 53, 55].includes(code)) return "/icons/weather/drizzle.png";
  if ([56, 57, 66, 67].includes(code)) return "/icons/weather/freezing_rain.png";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "/icons/weather/rain.png";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "/icons/weather/snow.png";
  if ([95, 96, 99].includes(code)) return "/icons/weather/thunderstorm_.png";
  return "/icons/weather/unknown.png";
}
