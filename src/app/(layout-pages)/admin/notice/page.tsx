"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Save,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NoticePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentDoc, setContentDoc] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchNotice();
  }, []);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      // Add trailing slash to avoid redirect which breaks CORS in some browsers
      const data = await api.get('/content/?mainPage=home&category=Notice');

      // Handle both array (content.py) and wrapped object (cms.py) response formats
      const noticeItems = Array.isArray(data) ? data : (data?.content || []);

      if (noticeItems && noticeItems.length > 0) {
        const notice = noticeItems[0];
        setContentDoc(Array.isArray(data) ? { content: data } : data);
        setForm({
          title: notice.title || 'Important Notice',
          description: notice.description || ''
        });
      } else {
        setContentDoc(Array.isArray(data) ? { content: [] } : data);
        setForm({ title: 'Important Notice', description: '' });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load notice content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        mainPage: 'home',
        subSection: '',
        category: 'Notice',
        type: 'text',
        title: form.title,
        description: form.description,
        status: 'draft',
        isActive: true
      };

      // Use the CMS upsert endpoint
      await api.put('/admin/cms/content', payload);
      toast.success('Notice saved as Draft');
      fetchNotice();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(`Save failed: ${error.message || 'Check connection'}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      // 1. First ensure content is saved with latest text
      const payload = {
        mainPage: 'home',
        subSection: '',
        category: 'Notice',
        type: 'text',
        title: form.title,
        description: form.description,
        status: 'published',
        isActive: true
      };
      await api.put('/admin/cms/content', payload);

      // 2. Fetch latest to get ID
      const data = await api.get('/content/?mainPage=home&category=Notice');
      const noticeItems = Array.isArray(data) ? data : (data?.content || []);
      const docId = noticeItems[0]?.id || noticeItems[0]?._id;

      if (!docId) throw new Error("Document ID missing");

      // 3. Publish
      await api.put(`/admin/cms/content/${docId}/publish`, {});
      
      toast.success('Notice published successfully!');
      fetchNotice();
    } catch (error: any) {
      console.error('Publish error:', error);
      toast.error(`Publishing failed: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading Notice configuration...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notice Management</h1>
          <p className="text-muted-foreground">Manage the "Important Notice" section displayed on the homepage.</p>
        </div>

        <div className="flex items-center gap-3">
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
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            className="gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={saving}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <ArrowRight size={16} />
            Publish Live
          </Button>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-amber-500" />
            Notice Content
          </CardTitle>
          <CardDescription>
            Update the title and paragraph of the notice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notice Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Important Notice"
              className="text-lg font-bold py-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notice Paragraph</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter the notice message here..."
              className="min-h-[200px] text-base leading-relaxed p-4"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 rounded-2xl">
        <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Live Preview Information
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-500">
          Changes saved as **Draft** will be stored but not visible to public users.
          Click **Publish Live** to push the changes to the main website.
        </p>
      </div>
    </div>
  );
}
