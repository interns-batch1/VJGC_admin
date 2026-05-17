"use client";

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  Search,
  Layers,
  Layout,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
  CheckCircle,
  X,
  Filter,
  Monitor,
  Database,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface UniversalContent {
  id: string;
  mainPage: string;
  subSection: string;
  category: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function UniversalCMS() {
  const [data, setData] = useState<UniversalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filtering & Search
  const [filters, setFilters] = useState({
    mainPage: '',
    subSection: '',
    category: ''
  });

  // Available Options (fetched from backend /all)
  const [availableOptions, setAvailableOptions] = useState<any>({});

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UniversalContent | null>(null);
  const [formData, setFormData] = useState({
    mainPage: '',
    subSection: '',
    category: '',
    title: '',
    description: '',
    image: '',
    order: 0,
    isActive: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchOptions();
    fetchContent();
  }, [filters]);

  const fetchOptions = async () => {
    try {
      const res = await api.get('/content/all');
      setAvailableOptions(res);
    } catch (error) {
      console.error('Failed to fetch options', error);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/content?${query}`);
      setData(res);
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.mainPage || !formData.subSection || !formData.category || !formData.title) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await api.put(`/content/${editingItem.id}`, formData);
        toast.success('Updated successfully');
      } else {
        await api.post('/content', formData);
        toast.success('Created successfully');
      }
      setIsModalOpen(false);
      fetchContent();
      fetchOptions();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/content/${id}`);
      toast.success('Deleted successfully');
      fetchContent();
      fetchOptions();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openModal = (item: UniversalContent | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        mainPage: filters.mainPage || '',
        subSection: filters.subSection || '',
        category: filters.category || '',
        title: '',
        description: '',
        image: '',
        order: 0,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading('Uploading image...', { id: 'upload' });
      const res = await api.upload(file);
      setFormData({ ...formData, image: res.url });
      toast.success('Image uploaded', { id: 'upload' });
    } catch (error) {
      toast.error('Upload failed', { id: 'upload' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
            <Monitor className="text-indigo-600 h-10 w-10" />
            Universal CMS
          </h1>
          <p className="text-slate-500 font-medium">Manage any page, section, or category dynamically.</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 shadow-xl shadow-indigo-500/20 gap-2 text-lg font-bold"
        >
          <Plus size={24} /> Create New Content
        </Button>
      </div>

      {/* DYNAMIC FILTERS */}
      <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Filter className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Quick Navigation & Filters</h3>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Main Page</Label>
              <select
                value={filters.mainPage}
                onChange={(e) => setFilters({ ...filters, mainPage: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-12 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">All Pages</option>
                {Object.keys(availableOptions).map(page => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Sub-Section</Label>
              <select
                value={filters.subSection}
                onChange={(e) => setFilters({ ...filters, subSection: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-12 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">All Sub-Sections</option>
                {filters.mainPage && availableOptions[filters.mainPage] && Object.keys(availableOptions[filters.mainPage]).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Category</Label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 h-12 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">All Categories</option>
                {filters.mainPage && filters.subSection && availableOptions[filters.mainPage][filters.subSection] && Object.keys(availableOptions[filters.mainPage][filters.subSection]).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONTENT GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mb-6" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Fetching Data from Cloud...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
            <Search className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">No Items Stored</h3>
          <p className="text-slate-500 font-medium mt-3 max-w-sm text-center">We couldn't find any content matching your current filters. Start by creating a new entry!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <div key={item.id} className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-2 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 rounded-[2rem] overflow-hidden m-2">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 gap-4">
                  <Button
                    onClick={() => openModal(item)}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-900 rounded-full h-12 font-bold gap-2"
                  >
                    <Edit2 size={18} /> Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="destructive"
                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">{item.mainPage}</span>
                  <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">{item.category}</span>
                </div>
              </div>
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order: {item.order}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.isActive ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
              </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/20">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <CardHeader className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">
                    {editingItem ? 'Refine Content' : 'Unleash New Content'}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-slate-500 mt-2">
                    {editingItem ? 'Updating existing cloud record' : 'Adding a new universal entry to your database'}
                  </CardDescription>
                </div>
                <Button variant="ghost" className="rounded-full w-12 h-12 p-0" onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              {/* TARGETING GROUP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Main Page *</Label>
                  <Input
                    value={formData.mainPage}
                    onChange={e => setFormData({ ...formData, mainPage: e.target.value })}
                    placeholder="e.g. Business Verticals"
                    className="h-14 rounded-2xl border-slate-200 font-bold"
                  />
                  <p className="text-[10px] text-slate-400 font-bold">Existing: {Object.keys(availableOptions).join(', ')}</p>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Sub-Section *</Label>
                  <Input
                    value={formData.subSection}
                    onChange={e => setFormData({ ...formData, subSection: e.target.value })}
                    placeholder="e.g. Travel"
                    className="h-14 rounded-2xl border-slate-200 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Category *</Label>
                  <Input
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Our Business"
                    className="h-14 rounded-2xl border-slate-200 font-bold"
                  />
                </div>
              </div>

              {/* CONTENT GROUP */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Headline / Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Capture attention with a title"
                    className="h-16 rounded-2xl border-slate-200 text-xl font-black"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Story / Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    placeholder="Describe this item in detail..."
                    className="rounded-[2rem] border-slate-200 text-lg font-medium p-6"
                  />
                </div>
              </div>

              {/* MEDIA & ORDER GROUP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Featured Image</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-video rounded-[2.5rem] border-4 border-dashed border-slate-200 hover:border-indigo-500 dark:border-slate-800 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                  >
                    {formData.image ? (
                      <>
                        <img src={formData.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg">Change Photo</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Select Visual Asset</p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="space-y-10 py-4">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Display Priority (Order)</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="h-14 rounded-2xl border-slate-200"
                    />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <Label className="text-sm font-black text-slate-900 dark:text-white">Active Status</Label>
                      <p className="text-xs text-slate-500 font-medium italic">Instantly toggle visibility on site</p>
                    </div>
                    <Button
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`rounded-full px-8 h-12 font-black tracking-widest text-[10px] uppercase transition-all ${formData.isActive
                        ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                        }`}
                    >
                      {formData.isActive ? 'Active' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-10 border-t border-slate-100 dark:border-slate-800 justify-end">
                <Button
                  variant="ghost"
                  className="rounded-full px-10 h-14 font-bold text-slate-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Discard Changes
                </Button>
                <Button
                  disabled={saving}
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-12 h-14 font-black shadow-xl shadow-indigo-500/20 gap-2"
                >
                  {saving ? <Loader2 size={24} className="animate-spin" /> : <Database size={24} />}
                  {editingItem ? 'Push Updates' : 'Publish Entry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
