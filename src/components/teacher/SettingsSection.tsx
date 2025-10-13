'use client'

import { Key, ReactNode, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, UserPlus, Search, Filter, Mail, Phone, BookOpen, TrendingUp } from 'lucide-react'

interface Student {
  grade: ReactNode
  phone: ReactNode
  email: ReactNode
  name: any
  id: Key | null | undefined
  materialsAccessed: number
  status: string;
}
const mockStudents: Student[] = [ /* ... (data unchanged) ... */ ];

export function StudentsSection() {
  const [students] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', grade: '' })

  const grades = ['all', '9th Grade', '10th Grade', '11th Grade', '12th Grade']
  const statuses = ['all', 'active', 'inactive']

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === 'all' || s.grade === selectedGrade;
    const matchesStatus =
      selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  })
  const activeStudents = students.filter(s => s.status === 'active')
  const totalMaterialsAccessed = students.reduce((sum, s) => sum + s.materialsAccessed, 0)
  const handleAddStudent = () => { /* ... (logic unchanged) ... */ }

  const statCards = [
    { title: 'Total Students', value: students.length, note: `${activeStudents.length} active`, icon: Users },
    { title: 'Materials Accessed', value: totalMaterialsAccessed, note: 'Across all students', icon: BookOpen },
    { title: 'Avg. Engagement', value: Math.round(totalMaterialsAccessed / students.length), note: 'Materials per student', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2a358c]">Student Management</h1>
        <p className="text-gray-500 mt-1">Manage student profiles, track activity, and communicate.</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(stat => (
          <Card key={stat.title} className="bg-white rounded-xl shadow-md">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-50"><stat.icon className="h-6 w-6 text-[#2a358c]" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-[#2a358c]">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.note}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Filters & Add Button */}
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center text-[#2a358c]"><Filter className="w-5 h-5 mr-3" /><span>Filter Students</span></CardTitle>
                <CardDescription className="mt-1">Quickly find students by name, grade, or status.</CardDescription>
            </div>
            {!isAddingStudent && <Button onClick={() => setIsAddingStudent(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"><UserPlus className="w-5 h-5 mr-2" />Add New Student</Button>}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10"/>
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}><SelectTrigger className="h-10"><SelectValue placeholder="All Grades" /></SelectTrigger><SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g === 'all' ? 'All Grades' : g}</SelectItem>)}</SelectContent></Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}><SelectTrigger className="h-10"><SelectValue placeholder="All Statuses" /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Add Student Form */}
      {isAddingStudent && (
        <Card className="bg-white rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-[#2a358c]">Add New Student</CardTitle>
            <CardDescription>Enter the student's information to enroll them in your portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label htmlFor="student-name" className="font-semibold">Full Name</Label><Input id="student-name" placeholder="John Doe" value={newStudent.name} onChange={(e) => setNewStudent(p => ({ ...p, name: e.target.value }))} className="mt-2"/></div>
              <div><Label htmlFor="student-email" className="font-semibold">Email Address</Label><Input id="student-email" type="email" placeholder="john.doe@example.com" value={newStudent.email} onChange={(e) => setNewStudent(p => ({ ...p, email: e.target.value }))} className="mt-2"/></div>
              <div><Label htmlFor="student-phone" className="font-semibold">Phone Number</Label><Input id="student-phone" placeholder="(123) 456-7890" value={newStudent.phone} onChange={(e) => setNewStudent(p => ({ ...p, phone: e.target.value }))} className="mt-2"/></div>
              <div><Label htmlFor="student-grade" className="font-semibold">Grade Level</Label><Select value={newStudent.grade} onValueChange={(v) => setNewStudent(p => ({ ...p, grade: v }))}><SelectTrigger className="mt-2"><SelectValue placeholder="Select grade" /></SelectTrigger><SelectContent>{grades.slice(1).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="flex space-x-3 pt-2">
              <Button onClick={handleAddStudent} size="lg" className="bg-[#2a358c] hover:bg-[#3a4a9f] text-white shadow-md"><UserPlus className="w-5 h-5 mr-2" />Add Student</Button>
              <Button variant="outline" size="lg" onClick={() => setIsAddingStudent(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-semibold text-[#2a358c]">{student.name.split(' ').map((n: any[]) => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">{student.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center"><Mail className="w-4 h-4 mr-1.5" /><span>{student.email}</span></div>
                    <div className="flex items-center"><Phone className="w-4 h-4 mr-1.5" /><span>{student.phone}</span></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="font-semibold text-[#2a358c]">{student.grade}</p>
                  <p className="text-xs text-gray-500">Grade</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-[#2a358c]">{student.materialsAccessed}</p>
                  <p className="text-xs text-gray-500">Accessed</p>
                </div>
                <div className="text-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{student.status}</span>
                </div>
                <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" />Contact</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No students found matching your criteria.
        </div>
      )}
    </div>
  )
}