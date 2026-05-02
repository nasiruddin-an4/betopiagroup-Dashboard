"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  FileText,
  Globe2,
  Newspaper,
  TrendingUp,
  UserCircle2,
  LayoutDashboard,
  Zap,
  ShieldCheck,
  Shapes,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const WEBSITE_PAGES = [
  {
    key: "home",
    name: "Home Page",
    href: "/content/home",
    targetComponents: 9,
  },
  {
    key: "vision-2030",
    name: "Vision 2030",
    href: "/content/vision-2030",
    targetComponents: 3,
  },
  {
    key: "about-us",
    name: "About Us",
    href: "/content/about-us",
    targetComponents: 3,
  },
  {
    key: "leadership",
    name: "Leadership",
    href: "/content/leadership",
    targetComponents: 2,
  },
  {
    key: "ventures",
    name: "Ventures",
    href: "/content/ventures",
    targetComponents: 2,
  },
  {
    key: "industries",
    name: "Industries",
    href: "/content/industries",
    targetComponents: 2,
  },
  {
    key: "career",
    name: "Career",
    href: "/content/career",
    targetComponents: 2,
  },
  {
    key: "contact-us",
    name: "Contact",
    href: "/content/contact-us",
    targetComponents: 1,
  },
  {
    key: "sitemap",
    name: "Site Map",
    href: "/content/sitemap",
    targetComponents: 1,
  },
];

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatShortDate(value) {
  const parsed = toDate(value);
  return parsed ? parsed.toLocaleDateString() : "—";
}

function getDaysAgo(date) {
  if (!date) return null;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [ventureItems, setVentureItems] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [lastLogin, setLastLogin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    setLastLogin(new Date().toLocaleString());
    fetchDashboardData(token);
  }, [router]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      const authHeaders = { Authorization: `Bearer ${token}` };
      const [contentRes, newsRes, logsRes, venturesRes] = await Promise.all([
        fetch("/api/admin/content", {
          headers: authHeaders,
          credentials: "include",
        }),
        fetch("/api/admin/news", {
          headers: authHeaders,
          credentials: "include",
        }),
        fetch("/api/admin/logs?limit=8", {
          headers: authHeaders,
          credentials: "include",
        }),
        fetch("/api/ventures", {
          headers: authHeaders,
          credentials: "include",
        }),
      ]);

      if (contentRes.status === 401 || contentRes.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      const contentData = await contentRes.json().catch(() => ({}));
      const newsData = await newsRes.json().catch(() => ({}));
      const logsData = await logsRes.json().catch(() => ({}));
      const venturesData = await venturesRes.json().catch(() => ({}));

      setContentItems(
        Array.isArray(contentData.content) ? contentData.content : [],
      );
      setNewsItems(Array.isArray(newsData.data) ? newsData.data : []);
      setRecentLogs(Array.isArray(logsData.logs) ? logsData.logs : []);
      setVentureItems(Array.isArray(venturesData.data) ? venturesData.data : []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const analytics = useMemo(() => {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const twoWeekMs = 14 * 24 * 60 * 60 * 1000;

    const pageSet = new Set(
      contentItems.map((item) => item.page).filter(Boolean),
    );
    const pageCountMap = contentItems.reduce((acc, item) => {
      if (!item.page) return acc;
      acc[item.page] = (acc[item.page] || 0) + 1;
      return acc;
    }, {});

    const recentContentUpdates = contentItems.filter((item) => {
      const stamp = toDate(item.updatedAt)?.getTime();
      return stamp && now - stamp <= weekMs;
    }).length;

    const latestContentUpdate =
      contentItems
        .map((item) => toDate(item.updatedAt))
        .filter(Boolean)
        .sort((a, b) => b - a)[0] || null;

    const categoryMap = newsItems.reduce((acc, item) => {
      const category = item.category || "General";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const featuredCount = newsItems.filter((item) => item.featured).length;
    const mediaCoverage = newsItems.filter((item) => !!item.image).length;
    const authorCount = new Set(
      newsItems.map((item) => item.author).filter(Boolean),
    ).size;

    const latestPublished =
      newsItems
        .map((item) => toDate(item.date || item.createdAt))
        .filter(Boolean)
        .sort((a, b) => b - a)[0] || null;

    const timeline = Array.from({ length: 14 }).map((_, idx) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (13 - idx));
      return {
        label: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        date,
        updates: 0,
      };
    });

    contentItems.forEach((item) => {
      const updatedAt = toDate(item.updatedAt);
      if (!updatedAt || now - updatedAt.getTime() > twoWeekMs) return;
      const dayKey = new Date(updatedAt);
      dayKey.setHours(0, 0, 0, 0);
      const target = timeline.find(
        (entry) => entry.date.getTime() === dayKey.getTime(),
      );
      if (target) target.updates += 1;
    });

    recentLogs.forEach((log) => {
      const timestamp = toDate(log.timestamp);
      if (!timestamp || now - timestamp.getTime() > twoWeekMs) return;
      const dayKey = new Date(timestamp);
      dayKey.setHours(0, 0, 0, 0);
      const target = timeline.find(
        (entry) => entry.date.getTime() === dayKey.getTime(),
      );
      if (target) target.updates += 1;
    });

    const maxTimelineValue = Math.max(
      ...timeline.map((item) => item.updates),
      1,
    );

    const pageHealth = WEBSITE_PAGES.map((page) => {
      const configured = pageCountMap[page.key] || 0;
      const completion = page.targetComponents
        ? Math.min(100, Math.round((configured / page.targetComponents) * 100))
        : configured > 0
          ? 100
          : 0;

      const latestForPage =
        contentItems
          .filter((item) => item.page === page.key)
          .map((item) => toDate(item.updatedAt))
          .filter(Boolean)
          .sort((a, b) => b - a)[0] || null;

      return {
        ...page,
        configured,
        completion,
        latestForPage,
      };
    });

    const configuredWebsitePages = pageHealth.filter(
      (page) => page.configured > 0,
    ).length;
    const completionRatio = Math.round(
      (configuredWebsitePages / WEBSITE_PAGES.length) * 100,
    );

    return {
      totalContent: contentItems.length,
      configuredPages: pageSet.size,
      configuredWebsitePages,
      completionRatio,
      recentContentUpdates,
      latestContentUpdate,
      totalNews: newsItems.length,
      totalVentures: ventureItems.length,
      featuredCount,
      mediaCoverage,
      authorCount,
      latestPublished,
      timeline,
      maxTimelineValue,
      pageHealth,
      categoryBreakdown,
    };
  }, [contentItems, newsItems, recentLogs]);

  return (
    <AdminSidebar>
      <div className="container mx-auto px-4 sm:px-0">
        {/* Welcome Section */}
        <div className="relative overflow-hidden backdrop-blur-sm border border-gray-200 rounded-xl p-8 mb-8">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-orange-50 text-[#f79549] rounded-full text-xs font-bold uppercase tracking-wider">
                  System Overview
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-['Outfit'] font-bold text-gray-900 mb-2">
                {greeting},{" "}
                <span className="text-[#f79549]">{user?.name || "Admin"}</span>
              </h1>
              <p className="text-gray-500 max-w-xl text-lg">
                Your portal to the Betopia ecosystem. Manage content quality,
                monitor media velocity, and architect the future of Bangladesh.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-white/80 border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                <ShieldCheck className="text-emerald-500" size={24} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Security Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    Verified & Secure
                  </p>
                </div>
              </div>
              <div className="bg-white/80 border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                <CalendarClock className="text-[#f79549]" size={24} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Last Login
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatShortDate(new Date())}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3 bg-orange-50 text-[#f79549] rounded-2xl">
                <Database size={24} />
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg flex items-center gap-1">
                <TrendingUp size={12} /> +2.4%
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Content
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                analytics.totalContent
              )}
            </h3>
          </div>

          <div className="group bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3 bg-red-50 text-[#ee2d46] rounded-2xl">
                <Globe2 size={24} />
              </div>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg">
                Coverage
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Page Readiness
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                `${analytics.completionRatio}%`
              )}
            </h3>
          </div>

          <div className="group bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Activity size={24} />
              </div>
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg">
                Last 7d
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Recent Updates
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                analytics.recentContentUpdates
              )}
            </h3>
          </div>

          <div className="group bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Shapes size={24} />
              </div>
              <span className="px-2 py-1 bg-orange-50 text-[#f79549] text-[10px] font-bold rounded-lg tracking-tight">
                Concerns
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Global Ventures
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                analytics.totalVentures
              )}
            </h3>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Charts & Quick Access */}
          <div className="lg:col-span-2 space-y-8">
            {/* Publishing Velocity */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Operational Velocity
                  </h2>
                  <p className="text-sm text-gray-500">
                    Activity tracking for the last 14 days
                  </p>
                </div>
                <Zap className="text-amber-400" size={24} />
              </div>
              <div className="relative h-64 flex items-end justify-between gap-1 group/chart">
                {analytics.timeline.map((item) => (
                  <div
                    key={item.label}
                    className="flex-1 flex flex-col items-center gap-3"
                  >
                    <div className="relative w-full group/bar">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none font-bold">
                        {item.updates} Updates
                      </div>
                      <div className="h-48 w-full bg-gray-50 rounded-xl flex items-end overflow-hidden p-1 border border-gray-50 shadow-inner">
                        <div
                          className="w-full bg-gradient-to-t from-[#f79549] to-[#ee2d46] rounded-lg transition-all duration-700 ease-out shadow-[0_0_15px_-3px_rgba(247,149,73,0.4)]"
                          style={{
                            height: `${Math.max(8, Math.round((item.updates / analytics.maxTimelineValue) * 100))}%`,
                            opacity: item.updates === 0 ? 0.3 : 1,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {item.label.split(" ")[1] || item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Status & Activity */}
          <div className="space-y-8">
            {/* Page Completion */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe2 size={18} className="text-blue-500" />
                Page Health
              </h3>
              <div className="space-y-4">
                {analytics.pageHealth.slice(0, 5).map((page) => (
                  <div key={page.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-700">
                        {page.name}
                      </span>
                      <span className="text-gray-400">{page.completion}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          page.completion > 80
                            ? "bg-emerald-500"
                            : page.completion > 40
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                        style={{ width: `${page.completion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/content/home"
                className="block mt-6 text-center text-xs font-bold text-[#f79549] hover:underline"
              >
                View All Pages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
