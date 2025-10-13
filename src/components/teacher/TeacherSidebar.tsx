'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image' // 1. Import the Next.js Image component
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Upload, 
  BookOpen, 
  Bell, 
  Users, 
  Settings,
  LogOut,
  Brain
} from 'lucide-react'

// 2. Update the RcpitLogo component to use the Image component
const RcpitLogo = () => (
  <Image
    src="../../assets/images/rcpit-logo.png" // The path starts from the 'public' directory
    alt="RCPIT Logo"
    width={40}
    height={40}
    className="rounded-full" // This makes the image circular
  />
);

type DashboardSection = 'overview' | 'upload' | 'materials' | 'notices' | 'students' | 'settings'

interface TeacherSidebarProps {
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
}

const navigationItems = [
  { id: 'overview' as DashboardSection, label: 'Dashboard', icon: LayoutDashboard, description: 'Overview and analytics' },
  { id: 'upload' as DashboardSection, label: 'Upload Content', icon: Upload, description: 'Upload PDFs, images, notices' },
  { id: 'materials' as DashboardSection, label: 'Materials', icon: BookOpen, description: 'Manage educational content' },
  { id: 'notices' as DashboardSection, label: 'Notices', icon: Bell, description: 'Announcements and alerts' },
  { id: 'students' as DashboardSection, label: 'Students', icon: Users, description: 'Student management' },
  { id: 'settings' as DashboardSection, label: 'Settings', icon: Settings, description: 'Account and preferences' }
]

export function TeacherSidebar({ activeSection, onSectionChange }: TeacherSidebarProps) {

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <RcpitLogo />
          <div>
            <h1 className="text-lg font-bold text-[#2a358c]">StudySync AI</h1>
            <p className="text-sm text-gray-500 -mt-1">Teacher Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                isActive && "bg-[#2a358c] text-white hover:bg-[#2a358c]/90",
                !isActive && "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <div className="flex items-center space-x-4">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold leading-tight">{item.label}</span>
                  <span className={cn(
                    "text-xs font-normal",
                    isActive ? "text-white/80" : "text-gray-500"
                  )}>
                    {item.description}
                  </span>
                </div>
              </div>
            </Button>
          )
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:bg-red-50 hover:text-[#9e1c20]"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-semibold">Sign Out</span>
        </Button>
      </div>
    </aside>
  )
}