import BottomNav from './BottomNav';

export default function AppLayout({ children, contentClass }) {
  return (
    <div className="app-layout">
      <main className={`app-content${contentClass ? ` ${contentClass}` : ''}`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
