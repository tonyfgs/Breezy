import BottomNav from './BottomNav';
import SideNav from './SideNav';
import RightSidebar from './RightSidebar';

export default function AppLayout({ children, contentClass }) {
  return (
    <div className="app-wrapper">
      <SideNav />
      <div className="app-layout">
        <main className={`app-content${contentClass ? ` ${contentClass}` : ''}`}>
          {children}
        </main>
        <BottomNav />
      </div>
      <RightSidebar />
    </div>
  );
}
