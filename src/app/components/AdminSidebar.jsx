"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  Target,
  Info,
  Briefcase,
  Building2,
  Mail,
  Crown,
  Rows3,
  ChevronDown,
  User,
  Gift,
  LayoutGrid,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Home Page", href: "/content/home", icon: Home },
    { name: "Vision 2030", href: "/content/vision-2030", icon: Target },
    { name: "About Us", href: "/content/about-us", icon: Info },
    { name: "Leadership", href: "/content/leadership", icon: Crown },
    { name: "Ecosystem", href: "/content/ventures", icon: Briefcase },
    { name: "Industries", href: "/content/industries", icon: Building2 },
    { name: "Career", href: "/content/career", icon: Users },
    { name: "Corporate Offers", href: "/corporate-offers", icon: Gift },
    { name: "Contact", href: "/content/contact-us", icon: Mail },
    { name: "Footer", href: "/content/footer", icon: Rows3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cookie token for middleware-based route protection
    document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
    // Redirect to login
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-['Outfit']">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#111111] border-r border-gray-800 transition-all duration-300 z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <Link href="/dashboard">
              <div className="relative w-full h-10">
                <Image
                  src="/betopia-logo.svg"
                  alt="Betopia Group"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#f79549] text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar Section Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <h2 className="text-lg font-bold text-gray-900 hidden sm:block">
              {navigation.find((item) => item.href === pathname)?.name ||
                "Dashboard Overview"}
            </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            <Link href="https://betopiagroup.com/" target="_blank">
              <button className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl transition-colors hover:bg-amber-400 group">
                <div className="text-left hidden sm:block">
                  <p className="text-gray-900 text-sm leading-none font-normal">
                    View Website
                  </p>
                </div>
              </button>
            </Link>
            {/* Profile Dropdown Toggle */}
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-xl transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#f79549] to-[#ee2d46] flex items-center justify-center text-white font-bold shadow-sm">
                <User size={18} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-gray-900 text-sm leading-none mb-1 font-normal">
                  {user?.name || "System Admin"}
                </p>
                <p className="text-gray-500 text-xs leading-none flex items-center font-normal">
                  Admin <ChevronDown size={12} className="ml-1 opacity-70" />
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileDropdownOpen(false)}
                ></div>

                {/* Menu Panel */}
                <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 transform origin-top-right transition-all">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-gray-900 text-sm font-normal truncate">
                      {user?.name || "System Admin"}
                    </p>
                    <p className="text-gray-500 text-xs truncate mt-1">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all text-sm"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1">{children}</div>
        <footer className="px-4 sm:px-8 pb-8 lg:ml-0">
          <div className="border border-gray-200 bg-white rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Betopia Group Admin Panel
            </p>
            <p className="text-xs text-gray-400">
              Content Ops • Website Management • Secure Access
            </p>
          </div>
        </footer>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
