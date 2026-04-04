import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react'

const WMO_EMOJI = {
  'Clear Sky': '☀️', 'Mainly Clear': '🌤️', 'Partly Cloudy': '⛅',
  'Overcast': '☁️', 'Foggy': '🌫️', 'Icy Fog': '🌫️',
  'Light Drizzle': '🌦️', 'Drizzle': '🌧️', 'Heavy Drizzle': '🌧️',
  'Light Rain': '🌧️', 'Rain': '🌧️', 'Heavy Rain': '⛈️',
  'Light Snow': '🌨️', 'Snow': '❄️', 'Heavy Snow': '❄️',
  'Rain Showers': '🌦️', 'Heavy Showers': '⛈️', 'Violent Showers': '⛈️',
  'Thunderstorm': '⛈️', 'Thunderstorm w/ Hail': '⛈️', 'Thunderstorm w/ Heavy Hail': '⛈️',
}

export default function WeatherWidget({ data }) {
  if (data?.weather_unavailable) {
    return (
      <div className="bg-white rounded-2xl border border-olive/20 p-5">
        <p className="text-[11px] font-bold text-ash uppercase tracking-widest mb-2">Weather</p>
        <p className="text-sm text-ash">Weather data unavailable for this location.</p>
      </div>
    )
  }

  const cur = data?.current || {}
  const forecast = data?.forecast || []

  return (
    <div className="bg-white rounded-2xl border border-olive/20 overflow-hidden">
      {/* Current */}
      <div className="bg-black-forest text-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1">
          {data?.location || 'Your Field'}
        </p>
        <div className="flex items-end gap-3">
          <span className="text-4xl">{WMO_EMOJI[cur.condition] || '🌤️'}</span>
          <div>
            <p className="font-cinzel font-black text-3xl leading-none">{cur.temperature_c ?? '--'}°</p>
            <p className="text-xs text-white/60 mt-0.5">{cur.condition}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { icon: Droplets, label: 'Humidity', val: `${cur.humidity_pct ?? '--'}%` },
            { icon: Wind, label: 'Wind', val: `${cur.wind_speed_kmh ?? '--'} km/h` },
            { icon: Thermometer, label: 'Rain', val: `${cur.precipitation_prob_pct ?? '--'}%` },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="text-center">
              <Icon className="w-3.5 h-3.5 text-white/40 mx-auto mb-0.5" />
              <p className="text-[10px] text-white/40">{label}</p>
              <p className="text-xs font-bold text-white/80">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="p-4 space-y-2">
        <p className="text-[10px] font-bold text-ash uppercase tracking-widest mb-3">5-Day Forecast</p>
        {forecast.map((day, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-ash text-xs w-20 shrink-0">
              {i === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
            </span>
            <span className="text-base">{WMO_EMOJI[day.condition] || '🌤️'}</span>
            <div className="flex items-center gap-1 text-xs text-right">
              <span className="font-bold text-black-forest">{day.temperature_max_c ?? '--'}°</span>
              <span className="text-ash">{day.temperature_min_c ?? '--'}°</span>
            </div>
            {day.precipitation_prob_pct > 40 && (
              <span className="text-[10px] text-blue-500 font-semibold">{day.precipitation_prob_pct}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
