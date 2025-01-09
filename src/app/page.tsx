import QRCodeGenerator from '@/components/QRCodeGenerator';
import { GithubIcon } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              QR Code Generator
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              Create beautiful, customizable QR codes for your business or personal use.
              Choose from various styles and download in multiple formats.
            </p>
          </div>
          
          <QRCodeGenerator />

          <footer className="w-full text-center text-sm text-muted-foreground mt-8">
            <div className="flex items-center justify-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <span>Built with Next.js and Tailwind CSS</span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}