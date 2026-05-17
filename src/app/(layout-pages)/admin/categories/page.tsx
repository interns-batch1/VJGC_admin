"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Edit2,
  Trash2,
  Save,
  Loader2,
  X,
  ChevronRight,
  Tag,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryItem {
  mainPage: string;
  subSection: string;
  category: string;
  count: number;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Edit state
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/cms/category-metadata');
      setCategories(res);
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!editingItem || !newCategoryName.trim()) return;
    setIsSaving(true);
    try {
      await api.put('/admin/cms/categories/rename', {
        oldMainPage: editingItem.mainPage,
        oldSubSection: editingItem.subSection,
        oldCategory: editingItem.category,
        newCategory: newCategoryName.trim(),
      });
      toast.success('Category renamed');
      setEditingItem(null);
      fetchCategories();
    } catch (e) {
      toast.error('Rename failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: CategoryItem) => {
    if (!confirm(`WARNING: This will delete ALL ${item.count} items in "${item.category}". Proceed?`)) return;
    try {
      await api.post('/admin/cms/categories/bulk-delete', {
        mainPage: item.mainPage,
        subSection: item.subSection,
        category: item.category,
      });
      toast.success('Category deleted');
      fetchCategories();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const filtered = categories.filter((c) =>
    (c.mainPage || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.subSection || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
            <Tag className="h-10 w-10 text-indigo-600" />
            Category Manager
          </h1>
          <p className="text-slate-500 font-medium">Edit, rename, or remove structural categories used across the site.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search categories..."
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b px-10 py-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-700">
              Active Categories
            </CardTitle>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-bold px-4 py-1">
              {filtered.length} found
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-32">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading categories…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-32">
              <AlertTriangle className="h-12 w-12 text-amber-300 mb-6" />
              <h3 className="text-xl font-bold text-slate-900">No Categories</h3>
              <p className="text-slate-500 mt-2">Try a different search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-900/50">
                    <th className="px-10 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Location</th>
                    <th className="px-10 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-10 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Items</th>
                    <th className="px-10 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{item.mainPage}</span>
                          {item.subSection && (
                            <>
                              <ChevronRight className="h-4 w-4 text-slate-300" />
                              <span className="text-slate-500 font-medium">{item.subSection}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        {editingItem === item ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <Input
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="h-10 rounded-xl border-indigo-200"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleRename} disabled={isSaving} className="bg-indigo-600 text-white">
                              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingItem(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                              {item.category}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full"
                              onClick={() => {
                                setEditingItem(item);
                                setNewCategoryName(item.category);
                              }}
                            >
                              <Edit2 className="h-4 w-4 text-slate-400" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-6">
                        <Badge variant="outline" className="rounded-full px-3 py-0.5 border-slate-200 text-slate-500 font-bold">
                          {item.count} items
                        </Badge>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Button
                          variant="ghost"
                          className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-bold h-10 px-4"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete All
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-indigo-100 bg-indigo-50/30 p-8 flex items-start gap-6">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200">
            <Tag className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-indigo-900">Rename Safely</h3>
            <p className="text-indigo-700/70 font-medium leading-relaxed">
              Renaming a category updates **every** content record linked to it, keeping your site consistent without manual edits.
            </p>
          </div>
        </Card>
        <Card className="rounded-3xl border-rose-100 bg-rose-50/30 p-8 flex items-start gap-6">
          <div className="bg-rose-600 p-4 rounded-2xl shadow-lg shadow-rose-200">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-rose-900">Delete with Caution</h3>
            <p className="text-rose-700/70 font-medium leading-relaxed">
              Deleting a category permanently removes all associated content. Use only when you intend to clear that entire section.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
