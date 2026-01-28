'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { tripApi } from '@/lib/api/trips';

export default function CreateTripPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'moderate',
    category: 'adventure',
    location: {
      country: '',
      city: '',
      address: ''
    },
    itinerary: [{ day: 1, title: '', description: '' }],
    inclusions: [''],
    exclusions: [''],
    startDates: ['']
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'vendor')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }]
    }));
  };

  const updateItinerary = (index: number, field: string, value: string) => {
    const updated = [...formData.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  const addItem = (field: 'inclusions' | 'exclusions' | 'startDates') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateItem = (field: 'inclusions' | 'exclusions' | 'startDates', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const removeItem = (field: 'inclusions' | 'exclusions' | 'startDates', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const durationDays = Number(formData.duration);
      const payload = {
        ...formData,
        price: {
          amount: Number(formData.price),
          currency: 'INR',
          priceType: 'per_person' as const
        },
        duration: {
          days: durationDays,
          nights: durationDays - 1
        },
        groupSize: {
          min: 2,
          max: Number(formData.maxGroupSize)
        },
        inclusions: formData.inclusions.filter(i => i.trim()),
        exclusions: formData.exclusions.filter(e => e.trim()),
        itinerary: formData.itinerary.map((day: any) => ({
          day: day.day,
          title: day.title,
          description: day.description,
          activities: day.activities || [],
          meals: day.meals || { breakfast: false, lunch: false, dinner: false }
        })),
        departures: formData.startDates.filter(d => d.trim()).map((d, idx) => ({
          _id: `departure_${idx}_${Date.now()}`,
          startDate: new Date(d).toISOString(),
          endDate: new Date(new Date(d).getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
          availableSpots: Number(formData.maxGroupSize),
          bookedSpots: 0,
          status: 'scheduled' as const
        }))
      };

      await tripApi.createTrip(payload);
      router.push('/vendor/trips');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'vendor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Create New Trip</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trip Title*</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Amazing Bali Adventure"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Describe your trip..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (USD)*</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (days)*</label>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Group Size*</label>
                  <Input
                    type="number"
                    name="maxGroupSize"
                    value={formData.maxGroupSize}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="nature">Nature</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty*</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Country*</label>
                <Input
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City*</label>
                <Input
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          {/* Itinerary */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Itinerary</h2>
              <Button type="button" variant="outline" onClick={addItineraryDay}>
                + Add Day
              </Button>
            </div>
            <div className="space-y-4">
              {formData.itinerary.map((day, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="font-medium mb-2">Day {day.day}</div>
                  <Input
                    placeholder="Title"
                    value={day.title}
                    onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                    className="mb-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={day.description}
                    onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Inclusions & Exclusions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Inclusions & Exclusions</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Inclusions</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem('inclusions')}>
                    + Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.inclusions.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateItem('inclusions', index, e.target.value)}
                        placeholder="e.g., Hotel accommodation"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem('inclusions', index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Exclusions</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem('exclusions')}>
                    + Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.exclusions.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateItem('exclusions', index, e.target.value)}
                        placeholder="e.g., Airfare"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem('exclusions', index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Start Dates */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Start Dates</h2>
              <Button type="button" variant="outline" onClick={() => addItem('startDates')}>
                + Add Date
              </Button>
            </div>
            <div className="space-y-2">
              {formData.startDates.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => updateItem('startDates', index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem('startDates', index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Error & Submit */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Creating...' : 'Create Trip'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
