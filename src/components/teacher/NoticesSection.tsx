'use client'

import { useState, useEffect, Key, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Plus, Edit, Trash2, Eye, Send, Calendar, Save, Loader2 } from 'lucide-react'

interface Notice {
  content: ReactNode
  category: string
  priority: string
  title: ReactNode
  _id: Key | null | undefined
  publishDate: any
  status: string;
}

export function NoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'general', priority: 'medium' as 'low' | 'medium' | 'high' });

  const categories = ['general', 'exam', 'assignment', 'event', 'reminder'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['all', 'draft', 'published', 'archived'];
  
  const fetchNotices = async () => { /* ... (logic unchanged) ... */ };
  useEffect(() => { fetchNotices(); }, []);

  const filteredNotices = notices.filter(n => selectedStatus === 'all' || n.status === selectedStatus);
  const handleFormChange = (field: string, value: string) => setFormData(p => ({ ...p, [field]: value }));
  const handleAddNew = () => { /* ... (logic unchanged) ... */ };
  const handleEdit = (notice: Notice) => { /* ... (logic unchanged) ... */ };
  const handleFormSubmit = async () => { /* ... (logic unchanged) ... */ };
  const handlePublishNotice = async (id: string) => { /* ... (logic unchanged) ... */ };
  const handleDeleteNotice = async (id: string) => { /* ... (logic unchanged) ... */ };
  
  const getCategoryColor = (c: string) => { /* ... (logic unchanged) ... */ };
  const getPriorityColor = (p: string) => { /* ... (logic unchanged) ... */ };
  const getStatusColor = (s: string) => { /* ... (logic unchanged) ... */ };

  if (isLoading) { return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-[#2a358c] animate-spin" /></div> }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2a358c]">Notices & Announcements</h1>
        <p className="text-gray-500 mt-1">Create, manage, and publish announcements for students.</p>
      </div>

      {view === 'form' ? (
        // Enhanced Form View
        <Card className="bg-white rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-[#2a358c]">{editingNotice ? 'Edit Notice' : 'Create New Notice'}</CardTitle>
            <CardDescription>{editingNotice ? 'Update the details for your announcement.' : 'Fill in the details for your new announcement.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title" className="font-semibold text-gray-700">Notice Title</Label>
              <Input id="title" placeholder="e.g., Mid-Term Exam Schedule" value={formData.title} onChange={(e) => handleFormChange('title', e.target.value)} className="mt-2"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category" className="font-semibold text-gray-700">Category</Label>
                <Select value={formData.category} onValueChange={(v) => handleFormChange('category', v)}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</SelectItem>)}</SelectContent></Select>
              </div>
              <div>
                <Label htmlFor="priority" className="font-semibold text-gray-700">Priority</Label>
                <Select value={formData.priority} onValueChange={(v:any) => handleFormChange('priority', v)}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
            <div>
              <Label htmlFor="content" className="font-semibold text-gray-700">Notice Content</Label>
              <Textarea id="content" placeholder="Write the main content of the notice here..." rows={8} value={formData.content} onChange={(e) => handleFormChange('content', e.target.value)} className="mt-2"/>
            </div>
            <div className="flex space-x-3 pt-2">
              <Button onClick={handleFormSubmit} disabled={isSubmitting} size="lg" className="bg-[#2a358c] hover:bg-[#3a4a9f] text-white shadow-md">
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                {isSubmitting ? 'Saving...' : (editingNotice ? 'Save Changes' : 'Save as Draft')}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setView('list')}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Enhanced List View
        <>
          <div className="flex justify-between items-center">
            <Card className="bg-white rounded-xl shadow-md">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Label className="text-gray-600">Status:</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent></Select>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleAddNew} className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"><Plus className="w-5 h-5 mr-2" />Create Notice</Button>
          </div>
          
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <Card key={notice._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-800">{notice.title}</CardTitle>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(notice.status)}`}>{notice.status}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(notice.priority)}`}>{notice.priority}</span>
                      </div>
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(notice.category)}`}>{notice.category}</span>
                        {notice.publishDate && (<div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /><span>Published: {new Date(notice.publishDate).toLocaleDateString()}</span></div>)}
                      </div>
                      <p className="text-gray-600 line-clamp-3">{notice.content}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {notice.status === 'draft' && (<Button size="sm" onClick={() => handlePublishNotice(String(notice._id))} className="bg-green-600 hover:bg-green-700 text-white"><Send className="w-4 h-4 mr-2" />Publish</Button>)}
                      <Button variant="outline" size="sm" onClick={() => handleEdit(notice)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-red-100 hover:text-red-600" onClick={() => handleDeleteNotice(String(notice._id))}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotices.length === 0 && !isLoading && (
            <Card className="bg-white rounded-xl shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <Bell className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-[#2a358c] mb-2">No Notices Found</h3>
                <p className="text-gray-500">{selectedStatus !== 'all' ? 'There are no notices with the selected status.' : 'Click the button below to create your first notice.'}</p>
                <Button onClick={handleAddNew} className="mt-6 bg-[#2a358c] hover:bg-[#3a4a9f] text-white"><Plus className="w-5 h-5 mr-2" />Create First Notice</Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}