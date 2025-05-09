import PneumoniaPredictor from '@/components/pneumonia-predictor';
import SiteHeader from '@/components/site-header';

export default function PredictPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PneumoniaPredictor />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        PneumoCheck &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
