import TranslatePanel from '@/components/TranslatePanel';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">中英文互译</h1>
        <TranslatePanel />
      </div>
    </main>
  );
}
