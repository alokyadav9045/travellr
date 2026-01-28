'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Cloud, Droplets, Wind, Eye, AlertTriangle, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TripLocation {
  latitude: number;
  longitude: number;
  address: string;
}

interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  icon: string;
  visibility: number;
}

interface Directions {
  distance: number;
  duration: number;
  summary: string;
  polyline: string;
  steps: Array<{
    instruction: string;
    distance: number;
  }>;
}

export default function TripMapComponent({ trip }: { trip: any }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [directions, setDirections] = useState<Directions | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripData();
  }, [trip]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch weather
      const weatherRes = await fetch(
        `/api/v1/trips/${trip._id}/weather`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData.data.current);
      setForecast(weatherData.data.forecast);

      // Fetch directions and nearby places
      const tripRes = await fetch(
        `/api/v1/trips/${trip._id}/directions`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const tripData = await tripRes.json();
      setDirections(tripData.data.directions);
      setNearbyPlaces(tripData.data.nearbyPlaces);
    } catch (error) {
      console.error('Error fetching trip data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading map data...</div>;
  }

  const tripCoords: [number, number] = [trip.location.latitude, trip.location.longitude];
  const icon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <MapContainer
            center={tripCoords as any}
            zoom={13}
            style={{ height: '500px' }}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            
            {/* Trip marker */}
            <Marker position={tripCoords as any} icon={icon as any}>
              <Popup>
                <div>
                  <p className="font-bold">{trip.title}</p>
                  <p className="text-sm text-gray-600">{trip.location.address}</p>
                </div>
              </Popup>
            </Marker>

            {/* Nearby places */}
            {nearbyPlaces.map((place, idx) => (
              <Marker
                key={idx}
                position={[place.latitude, place.longitude] as any}
                icon={L.icon({
                  iconUrl: `https://maps.google.com/mapfiles/ms/micons/blue.png`,
                  iconSize: [32, 32]
                }) as any}
              >
                <Popup>
                  <div>
                    <p className="font-semibold text-sm">{place.name}</p>
                    <p className="text-xs text-gray-600">{place.address}</p>
                    {place.rating && (
                      <p className="text-xs text-yellow-600">⭐ {place.rating}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Directions summary */}
          {directions && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-start gap-3">
                <Navigation size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{directions.summary}</p>
                  <div className="flex gap-6 mt-2 text-sm text-gray-600">
                    <span>📍 {directions.distance.toFixed(1)} km</span>
                    <span>⏱️ {directions.duration.toFixed(1)} hrs</span>
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
                      View directions ({directions.steps.length} steps)
                    </summary>
                    <div className="mt-2 space-y-1">
                      {directions.steps.map((step, idx) => (
                        <div key={idx} className="text-xs text-gray-600 ml-4">
                          <p dangerouslySetInnerHTML={{ __html: step.instruction }} />
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Weather & Info */}
      <div className="space-y-4">
        {/* Current Weather */}
        {weather && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Current Weather</h3>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-4xl font-bold">{Math.round(weather.temperature)}°C</p>
                <p className="text-blue-100">{weather.condition}</p>
                <p className="text-sm text-blue-100 mt-1">
                  Feels like {Math.round(weather.feelsLike)}°C
                </p>
              </div>
              <div className="text-5xl opacity-80">
                {weather.icon}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Droplets size={16} />
                <span>{weather.humidity}% Humidity</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind size={16} />
                <span>{weather.windSpeed} km/h Wind</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{weather.visibility} km Visibility</span>
              </div>
            </div>
          </div>
        )}

        {/* Weather Alerts */}
        {forecast.some((day: any) => day.alerts) && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <AlertTriangle size={20} />
              <p className="font-semibold">Weather Alerts</p>
            </div>
            <p className="text-sm text-yellow-700">
              Severe weather conditions possible during your trip. Check details before departing.
            </p>
          </div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-900 mb-3">Forecast</h3>
            <div className="space-y-2">
              {forecast.slice(0, 3).map((day: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-600">{day.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                    </p>
                    <p className="text-xs text-gray-600">
                      💧 {day.chanceOfRain}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Attractions */}
        {nearbyPlaces.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-900 mb-3">Nearby Attractions</h3>
            <div className="space-y-2">
              {nearbyPlaces.slice(0, 4).map((place: any, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded transition"
                >
                  <p className="text-sm font-semibold text-gray-900">{place.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600">{place.type[0]}</p>
                    {place.rating && (
                      <p className="text-xs text-yellow-600">⭐ {place.rating}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
