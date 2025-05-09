
import PneumoniaPredictor from '@/components/pneumonia-predictor';
import SiteHeader from '@/components/site-header';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PneumoniaPredictor />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="mb-2 md:mb-0">PneumoCheck &copy; {new Date().getFullYear()}</p>
          {/* 
          Social media links can be added here if needed in the future
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></Link>
          </div>
          */}
        </div>
      </footer>
    </div>
  );
}

