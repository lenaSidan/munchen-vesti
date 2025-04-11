export function getWeatherIcon(code: number): string {
  if ([0].includes(code)) return "/icons/weather/sun.png";
  if ([1, 2, 3].includes(code)) return "/icons/weather/cloud.png";
  if ([45, 48].includes(code)) return "/icons/weather/fog.png";
  if ([51, 53, 55].includes(code)) return "/icons/weather/drizzle.png";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "/icons/weather/rain.png";
  if ([66, 67].includes(code)) return "/icons/weather/freezing_rain.png";
  if ([71, 73, 75, 85, 86].includes(code)) return "/icons/weather/snow.png";
  if ([95, 96, 99].includes(code)) return "/icons/weather/thunderstorm.png";
  return "/icons/weather/unknown.png";
}
