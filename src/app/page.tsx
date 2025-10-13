"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Upload, Bell, Users, Brain, Shield, ArrowRight } from 'lucide-react'
import { HydrationHandler } from '@/components/HydrationHandler'
import Image from 'next/image'
import { motion } from 'framer-motion' 

// RCPIT Logo Component
const RcpitLogo = () => (
 <Image
    src="/assets/images/rcpit-logo.png"
    alt="RCPIT Logo"
    width={70}
    height={70}
    className="rounded-full"
  />
);

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
  } as const; 

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <HydrationHandler>
      <div className="min-h-screen bg-slate-50 text-gray-800 font-sans">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-yellow-50/90 backdrop-blur-lg border-b border-yellow-200/80 shadow-sm">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <RcpitLogo />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#2a358c]">StudySync AI</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-[#2a358c] transition-colors font-medium">
                Features
              </Link>
              <Link href="#cta" className="text-gray-700 hover:text-[#2a358c] transition-colors font-medium">
                Get Started
              </Link>
              <Link href="/teacher" className="text-gray-700 hover:text-[#2a358c] transition-colors font-medium">
                Teacher Portal
              </Link>
            </nav>
            <Button asChild className="bg-[#2a358c] hover:bg-[#3a4a9f] text-white font-semibold shadow-md transition-transform hover:scale-105">
              <Link href="/teacher">Access Portal</Link>
            </Button>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative bg-white overflow-hidden">
            <div className="container mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 items-center gap-12">
              <motion.div 
                className="text-center md:text-left"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2a358c] mb-6 leading-tight"
                  variants={fadeInUp}
                >
                  AI-Powered Academic Assistant
                </motion.h1>
                <motion.p 
                  className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto md:mx-0"
                  variants={fadeInUp}
                >
                  Streamline your teaching workflow with intelligent document management, 
                  automated content organization, and seamless student communication.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                  variants={fadeInUp}
                >
                  <Button size="lg" asChild className="bg-[#2a358c] hover:bg-[#3a4a9f] text-white font-bold shadow-lg transition-transform hover:scale-105 transform">
                    <Link href="/teacher">
                      Access Teacher Portal <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-[#2a358c] text-[#2a358c] hover:bg-[#2a358c]/10 font-bold">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* === CHANGE: Image replaced with animated Brain icon === */}
              <div className="hidden md:flex items-center justify-center p-8">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <Brain className="w-64 h-64 text-[#2a358c]/20" strokeWidth={1}/>
                </motion.div>
              </div>
              {/* === END CHANGE === */}

            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto px-6 py-24">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-[#2a358c] mb-4">Why Choose StudySync AI?</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Professional tools designed for modern educators to enhance efficiency and engagement.</p>
              <div className="mt-4 h-1.5 w-24 bg-[#2a358c] mx-auto rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { icon: Upload, title: "Smart Document Upload", desc: "Upload PDFs, images, and notices with intelligent categorization and organization." },
                { icon: Brain, title: "AI-Powered Organization", desc: "Automatic content tagging, search optimization, and smart recommendations." },
                { icon: Bell, title: "Smart Notifications", desc: "Automated alerts for important deadlines, student submissions, and updates." },
                { icon: Users, title: "Student Management", desc: "Track student progress, manage assignments, and facilitate communication." },
                { icon: BookOpen, title: "Content Library", desc: "Build a comprehensive library of educational resources and materials." },
                { icon: Shield, title: "Secure & Private", desc: "Enterprise-grade security with data encryption and privacy protection." },
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full group overflow-hidden">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        <feature.icon className="w-8 h-8 text-[#2a358c]" />
                      </div>
                      <CardTitle className="text-xl text-[#2a358c]">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-gray-600 leading-relaxed">
                        {feature.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* CTA Section */}
          <section id="cta" className="bg-gradient-to-r from-[#2a358c] to-[#3a4a9f] text-white">
            <div className="container mx-auto px-6 py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
                <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of educators who are using StudySync AI to enhance their teaching experience and create more impactful learning environments.
                </p>
                <Button size="lg" variant="secondary" asChild className="bg-white text-[#2a358c] hover:bg-gray-200 text-lg font-semibold py-4 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105">
                  <Link href="/teacher">Start Your Free Trial Today</Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Improved Footer */}
        <footer className="bg-gray-900 text-gray-400 border-t-4 border-[#2a358c]">
          <div className="container mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
              <div>
                <Link href="/" className="flex items-center justify-center md:justify-start space-x-3 mb-4 md:mb-0">
                  <RcpitLogo />
                  <span className="text-xl font-bold text-white">StudySync AI</span>
                </Link>
              </div>
              <div className="flex space-x-6 my-4 md:my-0">
                 <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                 <Link href="#cta" className="hover:text-white transition-colors">Get Started</Link>
                 <Link href="/teacher" className="hover:text-white transition-colors">Teacher Portal</Link>
              </div>
               <p className="text-sm">
                 © {new Date().getFullYear()} StudySync AI. All rights reserved.
               </p>
            </div>
          </div>
        </footer>
      </div>
    </HydrationHandler>
  )
}