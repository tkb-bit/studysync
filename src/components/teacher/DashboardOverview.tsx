'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Image, 
  Bell, 
  Users, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowRight, // Changed from Eye for better UX
  Upload
} from 'lucide-react'

// Helper to get different colors for activity icons
const getActivityIconStyle = (type: string) => {
  switch (type) {
    case 'upload':
      return "bg-blue-100 text-[#2a358c]";
    case 'notice':
      return "bg-yellow-100 text-yellow-600";
    case 'image':
      return "bg-purple-100 text-purple-600";
    case 'student':
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function DashboardOverview() {
  const stats = [
    {
      title: 'Total Materials',
      value: '124',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Images Uploaded',
      value: '89',
      change: '+8%',
      icon: Image,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Notices',
      value: '23',
      change: '+5%',
      icon: Bell,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Students',
      value: '156',
      change: '+3%',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ]

  const recentActivity = [
    { id: 1, type: 'upload', title: 'Mathematics Chapter 5 PDF', description: 'Uploaded new study material', time: '2 hours ago', icon: FileText },
    { id: 2, type: 'notice', title: 'Exam Schedule Update', description: 'Published new notice', time: '4 hours ago', icon: Bell },
    { id: 3, type: 'image', title: 'Science Lab Diagram', description: 'Uploaded experiment image', time: '6 hours ago', icon: Image },
    { id: 4, type: 'student', title: 'New Student Registration', description: 'Sarah Johnson joined class', time: '1 day ago', icon: Users }
  ]

  return (
    <div className="space-y-8 bg-slate-50 p-6 sm:p-8 rounded-lg">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2a358c]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's a summary of your portal's activity.</p>
        </div>
        <Button size="lg" className="bg-[#2a358c] hover:bg-[#3a4a9f] text-white shadow-md transition-transform hover:scale-105">
          <Upload className="w-5 h-5 mr-2" />
          Quick Upload
        </Button>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#2a358c]">{stat.value}</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>{stat.change} this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="bg-white rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-[#2a358c]">
                <Clock className="w-6 h-6 mr-3" />
                <span className="text-xl">Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest updates and activities from your portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityIconStyle(activity.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{activity.time}</p>
                        <ArrowRight className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <div>
          <Card className="bg-white rounded-xl shadow-md h-full">
            <CardHeader>
              <CardTitle className="text-[#2a358c] text-xl">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              {[
                { label: 'Upload PDF', icon: FileText },
                { label: 'Add Image', icon: Image },
                { label: 'New Notice', icon: Bell },
                { label: 'Add Student', icon: Users }
              ].map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Button key={action.label} variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 text-gray-600 hover:bg-[#2a358c]/5 hover:text-[#2a358c] transition-colors">
                    <ActionIcon className="w-6 h-6" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}