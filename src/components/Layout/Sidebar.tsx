import { Link, useLocation } from 'react-router-dom';
import { memo } from 'react';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/portfolio', label: 'Portfolios', icon: '💼' },
];

const Sidebar = memo(() => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 hidden md:flex">
      {/* Branding */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-text-dark">C.</span>
          <span className="text-lg font-semibold text-text-dark">capitalmind premium</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-nav-active text-text-dark font-semibold shadow-sm'
                      : 'text-text-dark hover:bg-gray-50 font-medium'
                  }`}
                >
                  <span className={`text-xl ${isActive ? '' : 'opacity-60'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Subscription Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
            RN
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-text-dark">CMP1Y</div>
            <div className="text-xs text-text-light">Valid till Apr 19, 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
