'use client'

import { useState } from 'react'
import { TeacherSidebar } from './TeacherSidebar'
import { DashboardOverview } from './DashboardOverview'
import { UploadSection } from './UploadSection'
import { MaterialsSection } from './MaterialsSection'
import { NoticesSection } from './NoticesSection'
import { StudentsSection } from './StudentsSection'
// If SettingsSection is a default export, use:

type DashboardSection = 'overview' | 'upload' | 'materials' | 'notices' | 'students' | 'settings'

export function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />
      case 'upload':
        return <UploadSection />
      case 'materials':
        return <MaterialsSection />
      case 'notices':
        return <NoticesSection />
      case 'students':
        return <StudentsSection />
      
      default:
        return <DashboardOverview />
    }
  }

  return (
    // Enhanced background and layout
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <TeacherSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        {/* Enhanced main content area with better padding */}
        <main className="flex-1 p-6 sm:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}