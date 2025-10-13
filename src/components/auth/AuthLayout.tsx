// src/components/auth/AuthLayout.tsx
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side: Branded Panel */}
      <div className="relative hidden h-full flex-col bg-[#2a358c] p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900/40" />
        <Link href="/" className="relative z-20 flex items-center text-2xl font-bold">
          <Image
            src="/assets/images/rcpit-logo.png"
            alt="StudySync AI Logo"
            width={50}
            height={50}
            className="mr-3 rounded-full"
          />
          StudySync AI
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “The best way to predict the future is to create it. Our platform helps educators build the future of learning, one student at a time.”
            </p>
            <footer className="text-sm">RCPIT Institute</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-[#2a358c]">{title}</h1>
            <p className="text-balance text-gray-500">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}