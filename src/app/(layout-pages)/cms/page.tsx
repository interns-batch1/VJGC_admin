"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Loader2,
  X,
  Save,
  ChevronRight,
  Layout,
  FileText,
  MousePointer2,
  Settings2,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

interface SubpageConfig {
  id: string;
  label: string;
}

interface PageConfig {
  id: string;
  label: string;
  subpages?: SubpageConfig[];
}

interface CMSPageWrapperProps {
  pageName: string;
  subpageName?: string | null;
}

interface ContentDoc {
  _id: string;
  page: string;
  subpage?: string;
  section: string;
  type: string;
  content: any;
  status: 'draft' | 'published';
}

interface SectionConfig {
  name: string;
  type: 'hero' | 'cards' | 'text' | 'news';
  label: string;
}

export default function CMSPage() {
  // Navigation State
  const [selectedPage, setSelectedPage] = useState('home');
  const [selectedSubpage, setSelectedSubpage] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionConfig | null>(null);

  // Data State
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [contentDoc, setContentDoc] = useState<ContentDoc | null>(null);

  // Loading & UI States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any | null>(null);

  // Form States
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', video_url: '', image_url: '', cta_text: '' });
  const [textForm, setTextForm] = useState({ title: '', subtitle: '', content: '', author: '', role: '' });
  const [cardForm, setCardForm] = useState({ title: '', description: '', image_url: '', icon_url: '', author: '', date: '' });

  const PAGES: PageConfig[] = [
    { id: 'home', label: 'Home Page' },
    {
      id: 'about', label: 'About Us', subpages: [
        { id: 'about-group', label: 'About Group' },
        { id: 'journey', label: 'Our Journey' },
        { id: 'leadership', label: 'Leadership' },
        { id: 'awards', label: 'Awards' },
        { id: 'foundation', label: 'Foundation' }
      ]
    },
    {
      id: 'business', label: 'Businesses', subpages: [
        { id: 'it-consulting', label: 'IT Consulting' },
        { id: 'data-centers', label: 'Enterprise Data Centers & Hosting Services' },
        { id: 'export-import', label: 'Export & Import' },
        { id: 'plantations', label: 'Plantations & Exotic Trees' },
        { id: 'it-training', label: 'IT Training' },
        { id: 'yoga-wellness', label: 'Yoga & Wellness' },
        { id: 'property-services', label: 'Property Services' },
        { id: 'green-energy', label: 'Green Energy & Solar Manufacturing' },
        { id: 'logistics', label: 'Logistics Services' },
        { id: 'travel-rentals', label: 'Travel & Rentals' }
      ]
    },
    {
      id: 'sustainability', label: 'Sustainability', subpages: [
        { id: 'Main landing', label: 'Main landing' },
        { id: 'Digital Transformation & IT Consulting', label: 'Digital Transformation & IT Consulting' },
        { id: 'Cloud, Hosting & Infrastructure', label: 'Cloud, Hosting & Infrastructure' },
        { id: 'Renewable Energy Solutions', label: 'Renewable Energy Solutions' },
        { id: 'Logistics & Trade Enablement', label: 'Logistics & Trade Enablement' },
        { id: 'Education & Skill Development', label: 'Education & Skill Development' },
        { id: 'Tree Plantation & Green Cover', label: 'Tree Plantation & Green Cover' },
        { id: 'Eco-conscious Technology Solutions', label: 'Eco-conscious Technology Solutions' },
        { id: 'Renewable Energy Adoption', label: 'Renewable Energy Adoption' },
        { id: 'Sustainable Business Practices', label: 'Sustainable Business Practices' },
        { id: 'Educational Support', label: 'Educational Support' },
        { id: 'Financial & Material Aid', label: 'Financial & Material Aid' },
        { id: 'Skill-Building Programs', label: 'Skill-Building Programs' },
        { id: 'Rural & Semi-Urban Engagement', label: 'Rural & Semi-Urban Engagement' },
        { id: 'Awareness Programs', label: 'Awareness Programs' },
        { id: 'Local Infrastructure Support', label: 'Local Infrastructure Support' }
      ]
    },
    { id: 'newsroom', label: 'Newsroom', subpages: [{ id: 'media-release', label: 'Media Release' }] }
  ];

  // --- Effects ---

  useEffect(() => {
    fetchSections();
  }, [selectedPage, selectedSubpage]);

  useEffect(() => {
    if (selectedSection) {
      fetchContent();
    } else {
      setContentDoc(null);
    }
  }, [selectedSection]);

  // --- API Calls ---

  const fetchSections = async () => {
    try {
      setLoading(true);
      const url = `/admin/cms/sections?page=${selectedPage}${selectedSubpage ? `&subpage=${selectedSubpage}` : ''}`;
      const data = await api.get(url);
      setSections(data);
      if (data.length > 0) {
        setSelectedSection(data[0]);
      } else {
        setSelectedSection(null);
      }
    } catch (error) {
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    if (!selectedSection) return;
    try {
      setLoading(true);
      const mPage = selectedPage === 'business' ? 'Business Verticals' : (selectedPage === 'about' ? 'About Us' : (selectedPage === 'sustainability' ? 'Sustainability' : selectedPage));
      const url = `/admin/cms/content?mainPage=${mPage}&subSection=${selectedSubpage || ''}&category=${selectedSection.label}`;
      const data = await api.get(url);

      if (data && data.content && data.content.length > 0) {
        setContentDoc(data);
        // Sync local forms
        if (data.type === 'hero') {
          const hero = data.content[0];
          setHeroForm({
            title: hero.title || '',
            subtitle: hero.description || hero.subtitle || '', // Map description to subtitle
            video_url: hero.video_url || hero.image || '',
            image_url: hero.image_url || hero.image || '',
            cta_text: hero.cta_text || ''
          });
        }
        if (data.type === 'text') {
          const text = data.content[0];
          setTextForm(text);
        }
      } else {
        setContentDoc(data);
        // Reset forms
        setHeroForm({ title: '', subtitle: '', video_url: '', image_url: '', cta_text: '' });
        setTextForm({ title: '', subtitle: '', content: '', author: '', role: '' });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async () => {
    if (!selectedSection) return;
    setSaving(true);
    try {
      const payload: any = {
        mainPage: selectedPage === 'business' ? 'Business Verticals' : (selectedPage === 'sustainability' ? 'Sustainability' : selectedPage),
        subSection: selectedSubpage,
        category: selectedSection.label,
        type: selectedSection.type,
        status: contentDoc?.status || 'draft'
      };

      if (selectedSection.type === 'hero') {
        // Flatten hero fields into payload and map subtitle -> description
        payload.title = heroForm.title;
        payload.description = heroForm.subtitle;
        payload.image = heroForm.video_url || heroForm.image_url;
        payload.image_url = heroForm.image_url;
        payload.video_url = heroForm.video_url;
        payload.cta_text = heroForm.cta_text;
      } else if (selectedSection.type === 'text') {
        Object.assign(payload, textForm);
      } else {
        payload.content = contentDoc?.content || [];
      }

      await api.put('/admin/cms/content', payload);
      toast.success('Section saved locally (Draft)');
      fetchContent();
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!contentDoc?._id) return;
    try {
      await api.put(`/admin/cms/content/${contentDoc._id}/publish`, {});
      toast.success('Section published to live website!');
      fetchContent();
    } catch (error) {
      toast.error('Publishing failed');
    }
  };

  // --- Card Management ---

  const handleOpenCardModal = (card: any = null) => {
    if (card) {
      setEditingCard(card);
      setCardForm(card);
    } else {
      setEditingCard(null);
      setCardForm({ title: '', description: '', image_url: '', icon_url: '', author: '', date: '' });
    }
    setIsCardModalOpen(true);
  };

  const handleSaveCard = async () => {
    if (!contentDoc?._id) {
      toast.error('Please save the section first to create a container');
      return;
    }

    try {
      setSaving(true);
      if (editingCard) {
        await api.put(`/admin/cms/content/${contentDoc._id}/card/${editingCard._card_id}`, cardForm);
        toast.success('Card updated');
      } else {
        // Use the universal endpoint for new cards
        const payload = {
          mainPage: selectedPage === 'business' ? 'Business Verticals' : (selectedPage === 'sustainability' ? 'Sustainability' : selectedPage),
          subSection: selectedSubpage,
          category: selectedSection?.label,
          title: cardForm.title,
          description: cardForm.description,
          image: cardForm.image_url // Unified image field
        };
        await api.post('/admin/cms/content', payload);
        toast.success('Card added');
      }
      setIsCardModalOpen(false);
      fetchContent();
    } catch (error) {
      toast.error('Card operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!contentDoc?._id || !confirm('Remove this card?')) return;
    try {
      await api.delete(`/admin/cms/content/${contentDoc._id}/card/${cardId}`);
      toast.success('Card removed');
      fetchContent();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'card' | 'text', field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading('Uploading...', { id: 'upload' });
      const result = await api.upload(file);
      const url = result.url;

      if (target === 'hero') setHeroForm({ ...heroForm, [field]: url });
      if (target === 'card') setCardForm({ ...cardForm, [field]: url });
      if (target === 'text') setTextForm({ ...textForm, [field]: url });

      toast.success('Upload complete', { id: 'upload' });
    } catch (error) {
      toast.error('Upload failed', { id: 'upload' });
    }
  };

  // --- Renderers ---

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar - Page & Subpage Navigation */}
      <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Website Pages</h2>
          <div className="space-y-1">
            {PAGES.map(page => (
              <div key={page.id}>
                <button
                  onClick={() => { setSelectedPage(page.id); setSelectedSubpage(null); }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedPage === page.id && !selectedSubpage
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Layout size={18} />
                    <span className="font-semibold text-sm">{page.label}</span>
                  </div>
                  {page.subpages && <ChevronRight size={14} className={selectedPage === page.id ? 'rotate-90 transition-transform' : ''} />}
                </button>

                {selectedPage === page.id && page.subpages && (
                  <div className="ml-9 mt-1 space-y-1 border-l border-slate-100 dark:border-slate-800 pl-2 animate-in slide-in-from-left-2 duration-200">
                    {page.subpages.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubpage(sub.id)}
                        className={`w-full text-left p-2 rounded-lg text-sm transition-all ${selectedSubpage === sub.id
                            ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-900/20'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                          }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Section Selector */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {sections.map(section => (
              <button
                key={section.name}
                onClick={() => setSelectedSection(section)}
                className={`flex flex-col items-center justify-center min-w-[100px] h-12 rounded-lg transition-all ${selectedSection?.name === section.name
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <span className="text-xs font-bold whitespace-nowrap px-4">{section.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6 ml-4">
            {contentDoc && (
              <div className="flex items-center gap-2 mr-4">
                {contentDoc.status === 'published' ? (
                  <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle size={14} /> Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-wider">
                    <Clock size={14} /> Draft
                  </span>
                )}
              </div>
            )}
            <Button
              onClick={handleSaveSection}
              disabled={saving || !selectedSection}
              variant="outline"
              className="gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={saving || !contentDoc}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <ArrowRight size={16} />
              Publish Live
            </Button>

            {contentDoc?.status === 'published' && (
              <a
                href={`/${selectedPage}${selectedSubpage ? `/${selectedSubpage}` : ''}`}
                target="_blank"
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm ml-4 px-4 py-2 bg-indigo-50 rounded-lg transition-all"
              >
                View Live <ArrowRight size={14} />
              </a>
            )}
          </div>
        </header>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 size={48} className="animate-spin text-indigo-600" />
              <p className="text-slate-400 font-medium">Synchronizing content...</p>
            </div>
          ) : selectedSection ? (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-300">
              {/* Hero Editor */}
              {selectedSection.type === 'hero' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main Heading</label>
                      <input
                        value={heroForm.title}
                        onChange={e => setHeroForm({ ...heroForm, title: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold"
                        placeholder="Enter main title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Call to Action Text</label>
                      <input
                        value={heroForm.cta_text}
                        onChange={e => setHeroForm({ ...heroForm, cta_text: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g., Get Started"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtitle / Description</label>
                    <textarea
                      value={heroForm.subtitle}
                      onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      rows={3}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      placeholder="e.g. Community • Empowerment • Trust"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Hero Video (MP4)</label>
                      <input
                        type="file"
                        accept="video/mp4"
                        onChange={e => handleImageUpload(e, 'hero', 'video_url')}
                        className="text-sm text-slate-500 mb-4"
                      />
                      <input
                        value={heroForm.video_url}
                        onChange={e => setHeroForm({ ...heroForm, video_url: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs border border-slate-200 dark:border-slate-800"
                        placeholder="Relative path or URL"
                      />
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Hero Image (Fallback)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'hero', 'image_url')}
                        className="text-sm text-slate-500 mb-4"
                      />
                      <div className="flex gap-4">
                        <input
                          value={heroForm.image_url}
                          onChange={e => setHeroForm({ ...heroForm, image_url: e.target.value })}
                          className="flex-1 bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs border border-slate-200 dark:border-slate-800"
                          placeholder="Image URL"
                        />
                        {heroForm.image_url && <img src={heroForm.image_url} className="h-8 w-8 rounded object-cover" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Editor */}
              {selectedSection.type === 'text' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Headline</label>
                    <input
                      value={textForm.title}
                      onChange={e => setTextForm({ ...textForm, title: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                      placeholder="Section headline"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rich Text Content</label>
                    <textarea
                      value={textForm.content}
                      onChange={e => setTextForm({ ...textForm, content: e.target.value })}
                      rows={10}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-serif leading-relaxed"
                      placeholder="Write your content here..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Author Name</label>
                      <input
                        value={textForm.author}
                        onChange={e => setTextForm({ ...textForm, author: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role / Designation</label>
                      <input
                        value={textForm.role}
                        onChange={e => setTextForm({ ...textForm, role: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                        placeholder="e.g. CEO, Vijayalakshmi Group"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cards & News Editor */}
              {(selectedSection.type === 'cards' || selectedSection.type === 'news') && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div>
                      <h3 className="text-lg font-bold">Dynamic {selectedSection.type === 'news' ? 'Releases' : 'Grid'}</h3>
                      <p className="text-slate-500 text-sm">Manage the items displayed in this section</p>
                    </div>
                    <Button onClick={() => handleOpenCardModal()} className="bg-indigo-600 hover:bg-indigo-700 gap-2 rounded-full px-6">
                      <Plus size={18} />
                      Add {selectedSection.type === 'news' ? 'Release' : 'Card'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {contentDoc?.content && Array.isArray(contentDoc.content) && contentDoc.content.length > 0 ? (
                      contentDoc.content.map((card: any) => (
                        <div key={card._card_id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-6 hover:shadow-lg hover:border-indigo-200 transition-all">
                          <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                            {card.image_url || card.icon_url ? (
                              <img src={card.image_url || card.icon_url} className="w-full h-full object-cover" />
                            ) : <ImageIcon className="text-slate-300" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{card.title}</h4>
                            <p className="text-slate-500 text-sm line-clamp-1">{card.description || card.date}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenCardModal(card)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={18} /></button>
                            <button onClick={() => handleDeleteCard(card._card_id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-400 font-medium italic">No items created yet. Click "Add" above.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <div className="h-24 w-24 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6">
                <MousePointer2 size={40} className="text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Select a Page & Section</h2>
              <p className="text-slate-500 max-w-sm">Pick a page from the left and then a section from the top to begin editing your content.</p>
            </div>
          )}
        </div>
      </main>

      {/* Card Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{editingCard ? 'Edit' : 'New'} {selectedSection?.type === 'news' ? 'Release' : 'Card'}</h3>
                <p className="text-slate-500">Configure the individual item properties</p>
              </div>
              <button onClick={() => setIsCardModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                  <input
                    value={cardForm.title}
                    onChange={e => setCardForm({ ...cardForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    placeholder="Item title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description / Body</label>
                  <textarea
                    value={cardForm.description}
                    onChange={e => setCardForm({ ...cardForm, description: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Detailed description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image / Icon Upload</label>
                    <input
                      type="file"
                      onChange={e => handleImageUpload(e, 'card', selectedSection?.type === 'news' ? 'image_url' : 'icon_url')}
                      className="text-xs text-slate-500"
                    />
                    <input
                      value={selectedSection?.type === 'news' ? cardForm.image_url : cardForm.icon_url}
                      onChange={e => setCardForm({ ...cardForm, [selectedSection?.type === 'news' ? 'image_url' : 'icon_url']: e.target.value })}
                      className="w-full bg-slate-50 p-2 rounded text-[10px] border border-slate-200 mt-2"
                      placeholder="URL path"
                    />
                  </div>
                  {selectedSection?.type === 'news' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Release Date</label>
                      <input
                        type="date"
                        value={cardForm.date}
                        onChange={e => setCardForm({ ...cardForm, date: e.target.value })}
                        className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none"
                      />
                    </div>
                  )}
                </div>

                {selectedSection?.type === 'news' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Author</label>
                    <input
                      value={cardForm.author}
                      onChange={e => setCardForm({ ...cardForm, author: e.target.value })}
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none"
                      placeholder="e.g. Media Team"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
              <Button onClick={() => setIsCardModalOpen(false)} variant="outline" className="flex-1 rounded-2xl py-6">Cancel</Button>
              <Button onClick={handleSaveCard} className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-2xl py-6 gap-2">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save {editingCard ? 'Changes' : 'Item'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
