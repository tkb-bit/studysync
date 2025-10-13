'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  ImageIcon, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  Loader2,
  Upload
} from 'lucide-react'

interface Material {
  id: string
  name: string
  type: 'pdf' | 'image'
  size: string
  category: string
  uploadDate: string
  downloads: number
  views: number
  fileURL: string
}

export function MaterialsSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/materials`)
        if (!response.ok) throw new Error('Failed to fetch materials.')
        const dbData = await response.json()
        const formattedMaterials: Material[] = dbData.map((item: any) => ({
          id: item._id, name: item.fileName, type: item.contentType.includes('pdf') ? 'pdf' : 'image',
          size: formatFileSize(item.size), category: item.category || 'Uncategorized',
          uploadDate: item.uploadDate, downloads: item.downloads || 0, views: item.views || 0,
          fileURL: item.fileURL,
        }));
        setMaterials(formattedMaterials)
      } catch (err: any) { setError(err.message) } finally { setIsLoading(false) }
    }
    fetchMaterials()
  }, [])

  const categories = ['all', 'Mathematics', 'Science', 'English', 'History', 'Physics', 'Uncategorized']
  const types = ['all', 'pdf', 'image']

  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || material.category === selectedCategory) &&
    (selectedType === 'all' || material.type === selectedType)
  )

  const getFileIcon = (type: 'pdf' | 'image') => {
    const styles = type === 'pdf' ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600";
    const Icon = type === 'pdf' ? FileText : ImageIcon;
    return <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${styles}`}><Icon className="w-6 h-6" /></div>
  }

  const getCategoryColor = (category: string) => { /* ... (no changes needed) ... */ return 'bg-gray-100 text-gray-800' }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-[#2a358c] animate-spin" /></div>
  }

  if (error) {
    return <p className="text-center text-red-500 p-8">Error: {error}</p>
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2a358c]">Materials Library</h1>
        <p className="text-gray-500 mt-1">Manage, search, and organize your educational content.</p>
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-[#2a358c]"><Filter className="w-5 h-5 mr-3" /><span>Filter & Search</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search materials by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10"/>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}><SelectTrigger className="h-10"><SelectValue placeholder="All Categories" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}</SelectContent></Select>
            <Select value={selectedType} onValueChange={setSelectedType}><SelectTrigger className="h-10"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t === 'all' ? 'All Types' : t.toUpperCase()}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Enhanced Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <CardHeader className="flex flex-row items-start space-x-4">
                {getFileIcon(material.type)}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold text-gray-800 line-clamp-2 leading-snug">{material.name}</CardTitle>
                  <p className="text-sm text-gray-500">{material.size}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full font-medium ${getCategoryColor(material.category)}`}>{material.category}</span>
                    <div className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" /><span>{new Date(material.uploadDate).toLocaleDateString()}</span></div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /><span>{material.views} views</span></div>
                    <div className="flex items-center"><Download className="w-4 h-4 mr-1.5" /><span>{material.downloads} downloads</span></div>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <a href={material.fileURL} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button size="sm" className="w-full bg-[#2a358c] hover:bg-[#3a4a9f] text-white">
                    <Download className="w-4 h-4 mr-2" />Download
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Enhanced Empty State
        <Card className="bg-white rounded-xl shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-[#2a358c] mb-2">No Materials Found</h3>
            <p className="text-gray-500 max-w-sm">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                ? "Your search or filter criteria didn't match any materials. Try adjusting your filters."
                : "Your library is currently empty. Click 'Upload Content' in the sidebar to add your first material."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}