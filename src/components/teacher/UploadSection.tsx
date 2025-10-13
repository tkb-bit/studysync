'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2 // A better loading spinner icon
} from 'lucide-react'

type UploadType = 'pdf' | 'image' | 'notice'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'success' | 'error'
  errorMessage?: string
}

export function UploadSection() {
  const [uploadType, setUploadType] = useState<UploadType>('pdf')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')
  const [category, setCategory] = useState('general')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // No changes needed for the onDrop and handlePublishNotice logic
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    for (const fileInfo of newFiles) {
      const fileToUpload = acceptedFiles.find(f => `${f.name}-${f.lastModified}` === fileInfo.id);
      if (!fileToUpload) continue;

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('category', category);

      try {
        const response = await fetch('/api/upload-file', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }
        if (data.ingested === false) {
          throw new Error('Upload succeeded but processing for chatbot search failed');
        }
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileInfo.id ? { ...f, status: 'success' } : f)
        );
      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileInfo.id ? { ...f, status: 'error', errorMessage: err.message } : f)
        );
      }
    }
  }, [category]);

  const handlePublishNotice = async () => {
    if (!noticeTitle || !noticeContent) {
      alert("Please fill in the notice title and content.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: noticeTitle, content: noticeContent, category, status: 'published' }),
      });
      if (!response.ok) { throw new Error('Failed to publish notice'); }
      alert('Notice published successfully!');
      setNoticeTitle('');
      setNoticeContent('');
      setCategory('general');
    } catch (err) {
      console.error(err);
      alert('Error publishing notice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: uploadType === 'pdf' 
      ? { 'application/pdf': ['.pdf'] }
      : { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    disabled: uploadType === 'notice'
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Helper for better file type icon styling
  const getFileIconStyle = (type: string) => {
    if (type.includes('pdf')) {
      return { Icon: FileText, className: "bg-blue-100 text-[#2a358c]" };
    }
    return { Icon: ImageIcon, className: "bg-purple-100 text-purple-600" };
  };

  return (
    <div className="space-y-8 bg-slate-50 p-6 sm:p-8 rounded-lg">
      {/* Enhanced Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2a358c]">Content Uploader</h1>
        <p className="text-gray-500 mt-1">Upload materials, images, or create notices for your portal.</p>
      </div>

      {/* Enhanced Upload Type Selector */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-[#2a358c]">1. Select Content Type</CardTitle>
          <CardDescription>Choose what you want to add to the portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'pdf', icon: FileText, label: 'PDF Document' },
              { type: 'image', icon: ImageIcon, label: 'Image File' },
              { type: 'notice', icon: MessageSquare, label: 'Notice' }
            ].map(item => (
              <button
                key={item.type}
                onClick={() => setUploadType(item.type as UploadType)}
                className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center space-y-3 ${
                  uploadType === item.type 
                    ? 'border-[#2a358c] bg-blue-50/50 shadow-inner' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-8 h-8 ${uploadType === item.type ? 'text-[#2a358c]' : 'text-gray-400'}`} />
                <span className={`font-semibold ${uploadType === item.type ? 'text-[#2a358c]' : 'text-gray-600'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Upload/Create Area */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-[#2a358c]">2. Add Details & Upload</CardTitle>
          <CardDescription>
            { uploadType === 'pdf' && "Upload PDF study materials for your students." }
            { uploadType === 'image' && "Upload relevant images (PNG, JPG, WebP)." }
            { uploadType === 'notice' && "Write and publish an announcement." }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {uploadType === 'notice' ? (
            // Enhanced Notice Creation Form
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="notice-title" className="font-semibold text-gray-700">Notice Title</Label>
                  <Input id="notice-title" placeholder="e.g., Mid-Term Exam Schedule" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="category" className="font-semibold text-gray-700">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notice-content" className="font-semibold text-gray-700">Notice Content</Label>
                <Textarea id="notice-content" placeholder="Enter the full details of the notice here..." rows={6} value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} className="mt-2" />
              </div>
              <Button onClick={handlePublishNotice} disabled={isSubmitting} size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow-md">
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <MessageSquare className="w-5 h-5 mr-2" />}
                {isSubmitting ? 'Publishing...' : 'Publish Notice'}
              </Button>
            </div>
          ) : (
            // Enhanced File Upload Area
            <div className="space-y-6">
              <div>
                <Label htmlFor="file-category" className="font-semibold text-gray-700">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="file-category" className="mt-2"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="timetable">Timetable</SelectItem>
                    <SelectItem value="study-material">Study Material</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div {...getRootProps()} className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${ isDragActive ? 'border-[#2a358c] bg-blue-50' : 'border-gray-300 bg-slate-50/50 hover:border-gray-400' }`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4 text-gray-500">
                  <UploadCloud className={`w-12 h-12 transition-colors ${isDragActive ? 'text-[#2a358c]' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-semibold text-lg text-[#2a358c]">{isDragActive ? 'Drop files here!' : 'Drag & drop files here'}</p>
                    <p className="text-gray-500">or click to browse your computer</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {uploadType === 'pdf' ? 'PDF files up to 10MB' : 'Images up to 5MB'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card className="bg-white rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-[#2a358c]">Upload Progress</CardTitle>
            <CardDescription>Manage your uploaded content below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => {
                const { Icon, className } = getFileIconStyle(file.type);
                return (
                  <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-slate-50/50">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${className}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {file.status === 'uploading' && <span className="flex items-center text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading</span>}
                      {file.status === 'success' && <span className="flex items-center text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full"><CheckCircle className="w-4 h-4 mr-2" />Success</span>}
                      {file.status === 'error' && <span className="flex items-center text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full" title={file.errorMessage}><AlertCircle className="w-4 h-4 mr-2" />Error</span>}
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-red-100 hover:text-red-600" onClick={() => removeFile(file.id)}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}