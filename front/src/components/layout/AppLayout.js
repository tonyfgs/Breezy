import BottomNav from './BottomNav';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <main className="app-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
