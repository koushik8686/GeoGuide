import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import Header from '../components/Header';

export default function AddPackage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    price: '',
    maxCapacity: '',
    accommodation: '',
    groupSize: '',
    difficulty: '',
    weather: '',
    meals: '',
    transportation: '',
    inclusions: '',
    highlights: '',
    agency: '',
    dates: [{ date: '', availableSpots: '', price: '' }]
  });
  const [images, setImages] = useState({
    image: null as File | null,
    agencyLogo: null as File | null
  });
  const [preview, setPreview] = useState({
    image: '',
    agencyLogo: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'agencyLogo') => {
    const file = e.target.files?.[0];
    if (file) {
      setImages(prev => ({ ...prev, [type]: file }));
      setPreview(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleDateChange = (index: number, field: string, value: string) => {
    const newDates = [...formData.dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setFormData(prev => ({ ...prev, dates: newDates }));
  };

  const addDateField = () => {
    setFormData(prev => ({
      ...prev,
      dates: [...prev.dates, { date: '', availableSpots: '', price: '' }]
    }));
  };

  const removeDateField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append images
      if (images.image) formDataToSend.append('image', images.image);
      if (images.agencyLogo) formDataToSend.append('agencyLogo', images.agencyLogo);

      // Convert inclusions and highlights to arrays
      const packageData = {
        ...formData,
        inclusions: formData.inclusions.split(',').map(item => item.trim()),
        highlights: formData.highlights.split(',').map(item => item.trim()),
        dates: formData.dates.map(date => ({
          ...date,
          availableSpots: parseInt(date.availableSpots),
          price: parseFloat(date.price)
        }))
      };

      formDataToSend.append('data', JSON.stringify(packageData));

      const response = await fetch('/api/packages', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to create package');

      navigate('/manager/packages');
    } catch (error) {
      console.error('Error creating package:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Add New Package" />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                required
                placeholder="e.g., 7 days"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.duration}
                onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Capacity</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.maxCapacity}
                onChange={e => setFormData(prev => ({ ...prev, maxCapacity: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Package Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Accommodation</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.accommodation}
                onChange={e => setFormData(prev => ({ ...prev, accommodation: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Group Size</label>
              <input
                type="text"
                required
                placeholder="e.g., 8-12 people"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.groupSize}
                onChange={e => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.difficulty}
                onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Weather</label>
              <input
                type="text"
                required
                placeholder="e.g., Mild, 20°C"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.weather}
                onChange={e => setFormData(prev => ({ ...prev, weather: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Meals</label>
              <input
                type="text"
                required
                placeholder="e.g., Breakfast + 5 Dinners"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.meals}
                onChange={e => setFormData(prev => ({ ...prev, meals: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Transportation</label>
            <input
              type="text"
              required
              placeholder="e.g., Private Bus + Ferry"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.transportation}
              onChange={e => setFormData(prev => ({ ...prev, transportation: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Inclusions (comma-separated)</label>
            <input
              type="text"
              required
              placeholder="e.g., Flights, Hotels, Tours, Meals"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.inclusions}
              onChange={e => setFormData(prev => ({ ...prev, inclusions: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Highlights (comma-separated)</label>
            <input
              type="text"
              required
              placeholder="e.g., City Tour, Mountain Trek, Beach Visit"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.highlights}
              onChange={e => setFormData(prev => ({ ...prev, highlights: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Agency Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.agency}
              onChange={e => setFormData(prev => ({ ...prev, agency: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Dates</h3>
          
          {formData.dates.map((date, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={date.date}
                    onChange={e => handleDateChange(index, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Available Spots</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={date.availableSpots}
                    onChange={e => handleDateChange(index, 'availableSpots', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={date.price}
                    onChange={e => handleDateChange(index, 'price', e.target.value)}
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDateField(index)}
                  className="mt-6 p-2 text-red-600 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addDateField}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Add Another Date
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Package Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {preview.image ? (
                <div className="space-y-1 text-center">
                  <img src={preview.image} alt="Preview" className="mx-auto h-32 w-32 object-cover" />
                  <label className="cursor-pointer text-indigo-600 hover:text-indigo-500">
                    Change Image
                    <input type="file" className="hidden" onChange={e => handleImageChange(e, 'image')} accept="image/*" />
                  </label>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input type="file" className="hidden" onChange={e => handleImageChange(e, 'image')} accept="image/*" required />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Agency Logo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {preview.agencyLogo ? (
                <div className="space-y-1 text-center">
                  <img src={preview.agencyLogo} alt="Preview" className="mx-auto h-32 w-32 object-cover" />
                  <label className="cursor-pointer text-indigo-600 hover:text-indigo-500">
                    Change Logo
                    <input type="file" className="hidden" onChange={e => handleImageChange(e, 'agencyLogo')} accept="image/*" />
                  </label>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input type="file" className="hidden" onChange={e => handleImageChange(e, 'agencyLogo')} accept="image/*" required />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/manager/packages')}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  );
}
