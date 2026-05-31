import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ShieldCheck, LogIn, Upload, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '1',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        setIsAuthenticated(true);
        toast.success('Login successful');
      } else {
        toast.error('Invalid password');
      }
    } catch (err) {
      toast.error('Server error. Is the backend running?');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('quantity', formData.quantity);
    form.append('adminPassword', password);
    form.append('image', imageFile);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        toast.success('Product added successfully!');
        setFormData({ name: '', description: '', price: '', quantity: '1' });
        setImageFile(null);
        setImagePreview(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to add product');
      }
    } catch (err) {
      toast.error('Failed to submit product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060F1C] flex items-center justify-center p-4">
        <div className="bg-[#0C1A2E] p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-sky-500/20 rounded-full flex items-center justify-center border border-sky-500/30">
              <ShieldCheck className="w-8 h-8 text-sky-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-2">Admin Access</h1>
          <p className="text-sky-100/60 text-center mb-8">Enter your secure password to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#060F1C] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-sky-100/40 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {isLoggingIn ? 'Verifying...' : 'Login securely'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060F1C] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-sky-400" />
              Admin Dashboard
            </h1>
            <p className="text-sky-100/60 mt-1">Manage your products and inventory</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-[#0C1A2E] rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-sky-400" />
            Add New Product
          </h2>
          
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-sky-100/80 mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#060F1C] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sky-100/80 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#060F1C] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 h-28 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sky-100/80 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-[#060F1C] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-100/80 mb-1">Quantity/Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg, 1 pack"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full bg-[#060F1C] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-sky-100/80 mb-1">Product Image</label>
              
              <div className="flex-1 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center bg-[#060F1C] relative overflow-hidden group hover:border-sky-500/50 transition-colors min-h-[250px]">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="w-12 h-12 text-sky-100/30 mx-auto mb-3" />
                    <p className="text-sm text-sky-100/60 mb-1">Click to upload image</p>
                    <p className="text-xs text-sky-100/40">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-white/10 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Cloudinary & MongoDB...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Add Product to Store
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
