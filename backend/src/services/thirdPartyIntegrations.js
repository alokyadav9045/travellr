// Google Maps integration service
const axios = require('axios');

class MapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.mapsClient = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api'
    });
  }

  /**
   * Get coordinates from address
   */
  async geocodeAddress(address) {
    try {
      const response = await this.mapsClient.get('/geocode/json', {
        params: {
          address,
          key: this.apiKey
        }
      });

      if (response.data.results.length === 0) {
        throw new Error('Address not found');
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng, address };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  /**
   * Calculate distance and duration between two points
   */
  async getDistanceMatrix(origin, destination) {
    try {
      const response = await this.mapsClient.get('/distancematrix/json', {
        params: {
          origins: `${origin.latitude},${origin.longitude}`,
          destinations: `${destination.latitude},${destination.longitude}`,
          key: this.apiKey,
          units: 'metric'
        }
      });

      const element = response.data.rows[0].elements[0];
      
      return {
        distance: element.distance.value / 1000, // Convert to km
        duration: element.duration.value / 3600, // Convert to hours
        distanceText: element.distance.text,
        durationText: element.duration.text
      };
    } catch (error) {
      console.error('Distance matrix error:', error);
      throw error;
    }
  }

  /**
   * Get directions between two points
   */
  async getDirections(origin, destination) {
    try {
      const response = await this.mapsClient.get('/directions/json', {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          key: this.apiKey,
          alternatives: true
        }
      });

      return response.data.routes.map((route) => ({
        summary: route.summary,
        distance: route.legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000,
        duration: route.legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 3600,
        polyline: route.overview_polyline.points,
        steps: route.legs.flatMap((leg) =>
          leg.steps.map((step) => ({
            instruction: step.html_instructions,
            distance: step.distance.value,
            duration: step.duration.value
          }))
        )
      }));
    } catch (error) {
      console.error('Directions error:', error);
      throw error;
    }
  }

  /**
   * Get places nearby
   */
  async getNearbyPlaces(location, radius = 5000, type = 'tourist_attraction') {
    try {
      const response = await this.mapsClient.get('/place/nearbysearch/json', {
        params: {
          location: `${location.latitude},${location.longitude}`,
          radius,
          type,
          key: this.apiKey
        }
      });

      return response.data.results.map((place) => ({
        id: place.place_id,
        name: place.name,
        type: place.types,
        rating: place.rating,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        address: place.vicinity
      }));
    } catch (error) {
      console.error('Nearby places error:', error);
      throw error;
    }
  }

  /**
   * Get place details
   */
  async getPlaceDetails(placeId) {
    try {
      const response = await this.mapsClient.get('/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,rating,photos,reviews,opening_hours,website,phone',
          key: this.apiKey
        }
      });

      return response.data.result;
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  }

  /**
   * Get static map image
   */
  getStaticMapUrl(location, zoom = 13, width = 400, height = 300) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=${zoom}&size=${width}x${height}&key=${this.apiKey}`;
  }

  /**
   * Get embed map
   */
  getEmbedUrl(location) {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14743.169968495648!2d${location.longitude}!3d${location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v`;
  }
}

// Weather API integration
class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.weatherClient = axios.create({
      baseURL: 'https://api.weatherapi.com/v1'
    });
  }

  /**
   * Get current weather for location
   */
  async getCurrentWeather(latitude, longitude) {
    try {
      const response = await this.weatherClient.get('/current.json', {
        params: {
          q: `${latitude},${longitude}`,
          key: this.apiKey,
          aqi: 'yes'
        }
      });

      const data = response.data.current;
      return {
        temperature: data.temp_c,
        condition: data.condition.text,
        humidity: data.humidity,
        windSpeed: data.wind_kph,
        windDirection: data.wind_dir,
        feelsLike: data.feelslike_c,
        uvIndex: data.uv,
        visibility: data.vis_km,
        pressure: data.pressure_mb,
        precipitation: data.precip_mm,
        icon: data.condition.icon,
        airQuality: data.air_quality ? {
          co: data.air_quality.co,
          no2: data.air_quality.no2,
          o3: data.air_quality.o3,
          so2: data.air_quality.so2,
          pm2_5: data.air_quality.pm2_5,
          pm10: data.air_quality.pm10,
          usEpaIndex: data.air_quality['us-epa-index']
        } : null
      };
    } catch (error) {
      console.error('Weather error:', error);
      throw error;
    }
  }

  /**
   * Get weather forecast
   */
  async getForecast(latitude, longitude, days = 3) {
    try {
      const response = await this.weatherClient.get('/forecast.json', {
        params: {
          q: `${latitude},${longitude}`,
          days,
          key: this.apiKey,
          aqi: 'yes'
        }
      });

      return response.data.forecast.forecastday.map((day) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        avgTemp: day.day.avgtemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
        chanceOfRain: day.day.daily_chance_of_rain,
        totalPrecipitation: day.day.totalprecip_mm,
        avgHumidity: day.day.avghumidity,
        avgWindSpeed: day.day.avgvis_km,
        uvIndex: day.day.uv,
        hourly: day.hour.map((hour) => ({
          time: hour.time,
          temperature: hour.temp_c,
          condition: hour.condition.text,
          humidity: hour.humidity,
          windSpeed: hour.wind_kph,
          chanceOfRain: hour.chance_of_rain
        }))
      }));
    } catch (error) {
      console.error('Forecast error:', error);
      throw error;
    }
  }

  /**
   * Get alerts for location
   */
  async getAlerts(latitude, longitude) {
    try {
      const response = await this.weatherClient.get('/alerts.json', {
        params: {
          q: `${latitude},${longitude}`,
          key: this.apiKey
        }
      });

      if (!response.data.alerts.alert) return [];

      return response.data.alerts.alert.map((alert) => ({
        headline: alert.headline,
        desc: alert.desc,
        severity: alert.severity,
        effective: alert.effective,
        expires: alert.expires,
        areas: alert.areas
      }));
    } catch (error) {
      console.error('Alerts error:', error);
      return [];
    }
  }
}

// SMS service with Twilio
class SMSService {
  constructor() {
    this.twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Send booking confirmation SMS
   */
  async sendBookingConfirmation(phoneNumber, bookingDetails) {
    try {
      const message = `
Booking Confirmed! 🎉
Trip: ${bookingDetails.tripTitle}
Booking #: ${bookingDetails.bookingNumber}
Date: ${bookingDetails.date}
Amount: ₹${bookingDetails.amount}
      `.trim();

      return await this.twilio.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  /**
   * Send payment confirmation SMS
   */
  async sendPaymentConfirmation(phoneNumber, paymentDetails) {
    try {
      const message = `
Payment Received! ✓
Amount: ₹${paymentDetails.amount}
Reference: ${paymentDetails.refNumber}
Status: ${paymentDetails.status}
Date: ${new Date().toLocaleDateString()}
      `.trim();

      return await this.twilio.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  /**
   * Send trip reminder SMS
   */
  async sendTripReminder(phoneNumber, tripDetails) {
    try {
      const message = `
Trip Reminder! 🚀
Trip: ${tripDetails.tripTitle}
Starting in: ${tripDetails.daysUntilDeparture} days
Meeting Point: ${tripDetails.meetingPoint}
Contact: ${tripDetails.vendorPhone}
      `.trim();

      return await this.twilio.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(phoneNumbers, message) {
    try {
      const results = await Promise.all(
        phoneNumbers.map((phone) =>
          this.twilio.messages.create({
            body: message,
            from: this.phoneNumber,
            to: phone
          })
        )
      );

      return {
        sent: results.length,
        failed: 0,
        results
      };
    } catch (error) {
      console.error('Bulk SMS error:', error);
      throw error;
    }
  }
}

// Error tracking with Sentry
class ErrorTrackingService {
  constructor() {
    const Sentry = require('@sentry/node');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      attachStacktrace: true
    });
    this.Sentry = Sentry;
  }

  /**
   * Capture exception
   */
  captureException(error, context = {}) {
    this.Sentry.captureException(error, {
      contexts: { ...context }
    });
  }

  /**
   * Capture message
   */
  captureMessage(message, level = 'info', context = {}) {
    this.Sentry.captureMessage(message, {
      level,
      contexts: { ...context }
    });
  }

  /**
   * Set user context
   */
  setUserContext(userId, email, role) {
    this.Sentry.setUser({
      id: userId,
      email,
      role
    });
  }

  /**
   * Track performance
   */
  trackPerformance(operationName, duration) {
    this.Sentry.captureMessage(`Operation: ${operationName} - Duration: ${duration}ms`, 'info');
  }

  /**
   * Create transaction for monitoring
   */
  createTransaction(name, op) {
    return this.Sentry.startTransaction({
      name,
      op
    });
  }
}

module.exports = {
  MapsService,
  WeatherService,
  SMSService,
  ErrorTrackingService
};
