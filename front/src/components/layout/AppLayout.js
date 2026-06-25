import BottomNav from './BottomNav';
import SideNav from './SideNav';
import RightSidebar from './RightSidebar';

export default function AppLayout({ children, contentClass, noSidebar }) {
  return (
    <div className="app-wrapper">
      <SideNav />
      <div className={`app-layout${noSidebar ? ' app-layout--wide' : ''}`}>
        <main className={`app-content${contentClass ? ` ${contentClass}` : ''}`}>
          {children}
        </main>
        <BottomNav />
      </div>
      {!noSidebar && <RightSidebar />}
    </div>
  );
}
