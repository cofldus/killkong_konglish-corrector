import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import styles from "./styles";

const { width, height } = Dimensions.get("window");

// 반응형 브레이크포인트 정의
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

const getDeviceType = () => {
  if (width <= BREAKPOINTS.mobile) return "mobile";
  if (width <= BREAKPOINTS.tablet) return "tablet";
  return "desktop";
};

const BACKEND_URL = "http://141.223.108.159:8000";

// Safe Area 대신 기기별 상수 정의
const SAFE_AREA_TOP =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;
const SAFE_AREA_BOTTOM = Platform.OS === "ios" ? 34 : 0;

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // #004aad 메인 컬러 팔레트
  const getTheme = () => ({
    // Primary - #004aad & Deep Blue Gradient
    primary: "#004aad", // Main Blue
    primaryDark: "#003d94",
    secondary: "#0056c7", // Lighter Blue
    secondaryDark: "#003688",

    // Backgrounds - Soft & Clean
    background: isDarkMode ? "#0F0F0F" : "#FAFAFA", // Near black / Soft white
    cardBg: isDarkMode ? "#1A1A1A" : "#FFFFFF",
    surfaceBg: isDarkMode ? "#262626" : "#F5F5F5",

    // Text Colors - High Contrast
    textPrimary: isDarkMode ? "#FAFAFA" : "#0A0A0A",
    textSecondary: isDarkMode ? "#A3A3A3" : "#525252",
    textTertiary: isDarkMode ? "#737373" : "#737373",

    // Accent Colors - Vibrant & Modern
    accent: "#1E88E5", // Blue-600
    success: "#10B981", // Emerald-500
    warning: "#F97316", // Orange-500
    error: "#EF4444", // Red-500

    // Special Colors
    glass: isDarkMode ? "rgba(26, 26, 26, 0.8)" : "rgba(255, 255, 255, 0.8)",
    blur: isDarkMode ? "rgba(15, 15, 15, 0.95)" : "rgba(250, 250, 250, 0.95)",

    // Navigation
    navBg: isDarkMode ? "rgba(26, 26, 26, 0.95)" : "rgba(255, 255, 255, 0.95)",
    navBorder: isDarkMode ? "#404040" : "#E5E5E5",
  });

  const theme = getTheme();

  // 네비게이션 메뉴 아이템들 - 킹콩 테마로 업데이트
  const navigationItems = [
    { id: "home", label: "Home", icon: "🦍", activeIcon: "🦍" },
    { id: "chat", label: "AI Chat", icon: "🔥", activeIcon: "🔥" },
    { id: "history", label: "History", icon: "📊", activeIcon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️", activeIcon: "⚙️" },
  ];

  const navigateToPage = (pageId) => {
    setCurrentPage(pageId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            theme={theme}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onNavigateToChat={() => navigateToPage("chat")}
          />
        );
      case "chat":
        return (
          <ChatPage
            theme={theme}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onNavigateToHome={() => navigateToPage("home")}
          />
        );
      case "history":
        return <HistoryPage theme={theme} isDarkMode={isDarkMode} />;
      case "settings":
        return (
          <SettingsPage
            theme={theme}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
        translucent={false}
      />

      {/* Floating Top Navigation - Ultra Modern */}
      {width > 768 && (
        <View
          style={[
            styles.floatingTopNav,
            {
              backgroundColor: theme.navBg,
              borderColor: theme.navBorder,
            },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View
              style={[
                styles.logoIcon,
                {
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                  backgroundColor: theme.primary,
                },
              ]}
            >
              <Text style={styles.logoEmoji}>🦍</Text>
            </View>
            <Text style={[styles.logoText, { color: theme.textPrimary }]}>
              KILL KONG
            </Text>
          </View>

          {/* Center Navigation Pills */}
          <View style={styles.navPills}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navPill,
                  currentPage === item.id && [
                    styles.navPillActive,
                    { backgroundColor: theme.primary },
                  ],
                ]}
                onPress={() => navigateToPage(item.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.navPillIcon,
                    {
                      color:
                        currentPage === item.id ? "#FFF" : theme.textSecondary,
                    },
                  ]}
                >
                  {item.icon}
                </Text>
                <Text
                  style={[
                    styles.navPillLabel,
                    {
                      color:
                        currentPage === item.id ? "#FFF" : theme.textSecondary,
                      fontWeight: currentPage === item.id ? "700" : "500",
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Right Actions */}
          <View style={styles.topNavActions}>
            <TouchableOpacity
              style={[
                styles.modernToggle,
                {
                  backgroundColor: isDarkMode
                    ? theme.secondary
                    : theme.surfaceBg,
                },
              ]}
              onPress={() => setIsDarkMode(!isDarkMode)}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleIcon}>{isDarkMode ? "🌙" : "☀️"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View
        style={[
          styles.mainContent,
          {
            top: width > 768 ? 100 : SAFE_AREA_TOP,
            bottom: width <= 768 ? 100 : 20,
          },
        ]}
      >
        {renderCurrentPage()}
      </View>

      {/* Floating Bottom Navigation - Mobile Only */}
      {width <= 768 && (
        <View
          style={[
            styles.floatingBottomNav,
            {
              backgroundColor: theme.navBg,
              borderColor: theme.navBorder,
            },
          ]}
        >
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.bottomNavItem,
                currentPage === item.id && styles.bottomNavItemActive,
              ]}
              onPress={() => navigateToPage(item.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.bottomNavIconContainer,
                  currentPage === item.id && [
                    styles.bottomNavIconActive,
                    { backgroundColor: theme.primary },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.bottomNavIcon,
                    {
                      color:
                        currentPage === item.id ? "#FFF" : theme.textSecondary,
                    },
                  ]}
                >
                  {item.icon}
                </Text>
              </View>
              <Text
                style={[
                  styles.bottomNavLabel,
                  {
                    color:
                      currentPage === item.id
                        ? theme.primary
                        : theme.textTertiary,
                    fontWeight: currentPage === item.id ? "600" : "400",
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// Ultra Modern HomePage Component - 백엔드 연결 로직 수정
function HomePage({ theme, isDarkMode, setIsDarkMode, onNavigateToChat }) {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [animatedValues, setAnimatedValues] = useState({
    glow: 0,
    float: 0,
    pulse: 0,
  });

  useEffect(() => {
    checkConnection();
    // 5초마다 연결 상태 확인 (첫 번째 코드와 동일하게)
    const interval = setInterval(checkConnection, 5000);

    // Modern animation loop
    const animationLoop = setInterval(() => {
      setAnimatedValues((prev) => ({
        glow: (prev.glow + 1) % 360,
        float: (prev.float + 1) % 100,
        pulse: (prev.pulse + 2) % 100,
      }));
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(animationLoop);
    };
  }, []);

  // 첫 번째 코드와 동일한 연결 체크 로직 사용
  const checkConnection = async () => {
    try {
      console.log("🔄 Checking connection to:", BACKEND_URL);
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: "GET",
        timeout: 5000, // AbortSignal 대신 timeout 사용
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Health check success:", data);
        setConnectionStatus(data.ai_ready ? "ready" : "loading");
      } else {
        console.log("❌ Health check failed - HTTP", response.status);
        setConnectionStatus("error");
      }
    } catch (error) {
      console.log("❌ Connection error:", error.message);
      setConnectionStatus("error");
    }
  };

  // Modern card data - 킹콩 테마로 업데이트
  const trendingExamples = [
    {
      text: "Let's grab coffee sometime",
      icon: "☕",
      category: "Social",
      gradient: ["#004aad", "#0056c7"],
      trend: "+47% this week",
    },
    {
      text: "I'm working on a new project",
      icon: "💻",
      category: "Work",
      gradient: ["#0056c7", "#1E88E5"],
      trend: "Trending",
    },
    {
      text: "What's your thoughts on this?",
      icon: "💭",
      category: "Opinion",
      gradient: ["#003d94", "#004aad"],
      trend: "New",
    },
    {
      text: "I need some help with English",
      icon: "🔥",
      category: "Learning",
      gradient: ["#1E88E5", "#004aad"],
      trend: "Popular",
    },
  ];

  const modernFeatures = [
    {
      icon: "🧠",
      title: "AI-Powered",
      desc: "Next-gen language processing",
      gradient: ["#004aad", "#0056c7"],
      stats: "99.9% accuracy",
    },
    {
      icon: "🦍",
      title: "Kong Strong",
      desc: "Dominate your English skills",
      gradient: ["#0056c7", "#1E88E5"],
      stats: "< 0.5s",
    },
    {
      icon: "🎯",
      title: "Context Aware",
      desc: "Understands your intent",
      gradient: ["#003d94", "#004aad"],
      stats: "Smart AI",
    },
  ];

  return (
    <ScrollView
      style={[styles.modernContainer, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.modernContentContainer}
    >
      {/* Modern Hero Section */}
      <View style={styles.modernHero}>
        {/* Floating Elements */}
        <View style={styles.floatingElements}>
          <View
            style={[
              styles.floatingCard,
              {
                backgroundColor: `${theme.primary}15`,
                transform: [
                  { translateY: Math.sin(animatedValues.float * 0.05) * 5 },
                  { rotate: `${Math.sin(animatedValues.float * 0.03) * 2}deg` },
                ],
              },
            ]}
          />
          <View
            style={[
              styles.floatingCard,
              {
                backgroundColor: `${theme.secondary}10`,
                right: 20,
                top: 100,
                transform: [
                  { translateY: Math.cos(animatedValues.float * 0.04) * 8 },
                  { rotate: `${Math.cos(animatedValues.float * 0.02) * 3}deg` },
                ],
              },
            ]}
          />
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                connectionStatus === "ready"
                  ? `${theme.success}20`
                  : `${theme.warning}20`,
              borderColor:
                connectionStatus === "ready" ? theme.success : theme.warning,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  connectionStatus === "ready" ? theme.success : theme.warning,
              },
            ]}
          />
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>
            {connectionStatus === "ready"
              ? "Kong Ready"
              : connectionStatus === "loading"
                ? "Loading Kong..."
                : connectionStatus === "checking"
                  ? "Connecting..."
                  : "Kong Offline"}
          </Text>
        </View>

        {/* Main Hero Content */}
        <View style={styles.heroContent}>
          <View
            style={[
              styles.modernAppIcon,
              {
                transform: [
                  { scale: 0.95 + Math.sin(animatedValues.pulse * 0.1) * 0.05 },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.iconGlow,
                {
                  backgroundColor: `${theme.primary}30`,
                  transform: [
                    { scale: 1 + Math.sin(animatedValues.glow * 0.05) * 0.1 },
                  ],
                },
              ]}
            />
            <Text style={styles.heroIcon}>🦍</Text>
          </View>

          <View style={styles.heroText}>
            <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
              KILL KONG
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
              Dominate English with AI Power
            </Text>
            <Text
              style={[styles.heroDescription, { color: theme.textTertiary }]}
            >
              Unleash the beast within your language skills 🦍🔥
            </Text>
          </View>

          {/* Modern CTA Button */}
          <TouchableOpacity
            style={[
              styles.modernCTA,
              {
                backgroundColor: theme.primary,
                opacity: connectionStatus === "ready" ? 1 : 0.6,
                transform: [{ scale: connectionStatus === "ready" ? 1 : 0.95 }],
              },
            ]}
            onPress={
              connectionStatus === "ready" ? onNavigateToChat : checkConnection
            }
            activeOpacity={0.8}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaText}>
                {connectionStatus === "ready"
                  ? "Start Dominating"
                  : connectionStatus === "error"
                    ? "Retry Connection"
                    : "Loading..."}
              </Text>
              <Text style={styles.ctaIcon}>
                {connectionStatus === "ready"
                  ? "🔥"
                  : connectionStatus === "error"
                    ? "🔄"
                    : "⏳"}
              </Text>
            </View>
            <View
              style={[
                styles.ctaGlow,
                { backgroundColor: `${theme.primary}30` },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Trending Examples */}
      <View style={styles.trendingSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            🔥 Kong's Favorites
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
          >
            What Kong is crushing today
          </Text>
        </View>

        <View style={styles.trendingGrid}>
          {trendingExamples.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.trendingCard, { backgroundColor: theme.cardBg }]}
              onPress={onNavigateToChat}
              activeOpacity={0.9}
            >
              <View style={styles.trendingCardHeader}>
                <View
                  style={[
                    styles.trendingIcon,
                    { backgroundColor: `${item.gradient[0]}15` },
                  ]}
                >
                  <Text style={styles.trendingIconText}>{item.icon}</Text>
                </View>
                <View
                  style={[
                    styles.trendBadge,
                    { backgroundColor: `${theme.primary}15` },
                  ]}
                >
                  <Text
                    style={[styles.trendBadgeText, { color: theme.primary }]}
                  >
                    {item.trend}
                  </Text>
                </View>
              </View>

              <Text
                style={[styles.trendingCategory, { color: theme.textTertiary }]}
              >
                {item.category.toUpperCase()}
              </Text>

              <Text style={[styles.trendingText, { color: theme.textPrimary }]}>
                "{item.text}"
              </Text>

              <View style={styles.trendingFooter}>
                <Text style={[styles.tryText, { color: theme.secondary }]}>
                  Let Kong fix it →
                </Text>
              </View>

              {/* Card glow effect */}
              <View
                style={[
                  styles.cardGlow,
                  {
                    backgroundColor: `${item.gradient[0]}10`,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modern Features */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          🦍 Kong Power
        </Text>

        <View style={styles.modernFeaturesGrid}>
          {modernFeatures.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.modernFeatureCard,
                { backgroundColor: theme.cardBg },
              ]}
            >
              <View
                style={[
                  styles.featureIconBg,
                  {
                    backgroundColor: `${feature.gradient[0]}15`,
                  },
                ]}
              >
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </View>

              <View style={styles.featureContent}>
                <Text
                  style={[styles.featureTitle, { color: theme.textPrimary }]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[styles.featureDesc, { color: theme.textSecondary }]}
                >
                  {feature.desc}
                </Text>
                <Text style={[styles.featureStats, { color: theme.primary }]}>
                  {feature.stats}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Demo Section with Modern Design */}
      <View style={styles.modernDemoSection}>
        <View style={[styles.demoCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.demoHeader}>
            <Text style={[styles.demoTitle, { color: theme.textPrimary }]}>
              🦍 Kong Transform
            </Text>
            <Text style={[styles.demoSubtitle, { color: theme.textSecondary }]}>
              Watch Kong crush bad English
            </Text>
          </View>

          <View style={styles.demoFlow}>
            {/* Before */}
            <View style={styles.demoStep}>
              <View
                style={[
                  styles.demoBadge,
                  { backgroundColor: `${theme.error}15` },
                ]}
              >
                <Text style={[styles.demoBadgeText, { color: theme.error }]}>
                  Before
                </Text>
              </View>
              <View
                style={[
                  styles.demoTextBubble,
                  {
                    backgroundColor: `${theme.error}10`,
                    borderColor: `${theme.error}30`,
                  },
                ]}
              >
                <Text style={[styles.demoText, { color: theme.textPrimary }]}>
                  "I want to go open car driving"
                </Text>
              </View>
            </View>

            {/* Arrow */}
            <View style={styles.demoArrow}>
              <View
                style={[
                  styles.arrowContainer,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={[styles.arrowText, { color: "#FFF" }]}>🦍</Text>
              </View>
            </View>

            {/* After */}
            <View style={styles.demoStep}>
              <View
                style={[
                  styles.demoBadge,
                  { backgroundColor: `${theme.success}15` },
                ]}
              >
                <Text style={[styles.demoBadgeText, { color: theme.success }]}>
                  After
                </Text>
              </View>
              <View
                style={[
                  styles.demoTextBubble,
                  {
                    backgroundColor: `${theme.success}10`,
                    borderColor: `${theme.success}30`,
                  },
                ]}
              >
                <Text style={[styles.demoText, { color: theme.textPrimary }]}>
                  "I want to go for a drive"
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// Modern History Page
function HistoryPage({ theme }) {
  const [historyData, setHistoryData] = useState([
    {
      id: 1,
      before: "I want to go open car driving",
      after: "I want to go for a drive",
      time: "2m ago",
      category: "Grammar",
      improvements: 3,
    },
    {
      id: 2,
      before: "How are you doing today?",
      after: "How are you doing today?",
      time: "5m ago",
      category: "Perfect!",
      improvements: 0,
    },
    {
      id: 3,
      before: "I want to meeting you",
      after: "I want to meet you",
      time: "1h ago",
      category: "Verb Form",
      improvements: 1,
    },
  ]);

  return (
    <View
      style={[styles.modernContainer, { backgroundColor: theme.background }]}
    >
      {/* Modern Header */}
      <View style={styles.modernPageHeader}>
        <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>
          🦍 Kong's Victories
        </Text>
        <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
          Track your conquests with Kong
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>47</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Crushed
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.statNumber, { color: theme.success }]}>92%</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Dominance
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.statNumber, { color: theme.accent }]}>7d</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Streak
          </Text>
        </View>
      </View>

      {/* History List */}
      <ScrollView
        style={styles.historyList}
        showsVerticalScrollIndicator={false}
      >
        {historyData.map((item) => (
          <View
            key={item.id}
            style={[
              styles.modernHistoryCard,
              { backgroundColor: theme.cardBg },
            ]}
          >
            <View style={styles.historyCardHeader}>
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor:
                      item.improvements > 0
                        ? `${theme.primary}15`
                        : `${theme.success}15`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        item.improvements > 0 ? theme.primary : theme.success,
                    },
                  ]}
                >
                  {item.category}
                </Text>
              </View>
              <Text style={[styles.timeText, { color: theme.textTertiary }]}>
                {item.time}
              </Text>
            </View>

            <View style={styles.historyComparison}>
              <View style={styles.beforeSection}>
                <Text
                  style={[styles.beforeText, { color: theme.textSecondary }]}
                >
                  "{item.before}"
                </Text>
              </View>

              {item.improvements > 0 && (
                <>
                  <Text
                    style={[styles.comparisonArrow, { color: theme.primary }]}
                  >
                    🦍
                  </Text>
                  <View style={styles.afterSection}>
                    <Text
                      style={[styles.afterText, { color: theme.textPrimary }]}
                    >
                      "{item.after}"
                    </Text>
                  </View>
                </>
              )}
            </View>

            {item.improvements > 0 && (
              <View style={styles.improvementsBadge}>
                <Text
                  style={[styles.improvementsText, { color: theme.accent }]}
                >
                  {item.improvements} Kong fix
                  {item.improvements > 1 ? "es" : ""}
                </Text>
              </View>
            )}
          </View>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// Modern Settings Page
function SettingsPage({ theme, isDarkMode, setIsDarkMode }) {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const settingGroups = [
    {
      title: "Appearance",
      items: [
        {
          icon: isDarkMode ? "🌙" : "☀️",
          title: "Dark Mode",
          subtitle: "Switch between light and dark theme",
          type: "toggle",
          value: isDarkMode,
          onToggle: setIsDarkMode,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: "🔔",
          title: "Push Notifications",
          subtitle: "Get notified about Kong victories",
          type: "toggle",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: "🔊",
          title: "Sound Effects",
          subtitle: "Play sounds for Kong interactions",
          type: "toggle",
          value: soundEnabled,
          onToggle: setSoundEnabled,
        },
      ],
    },
  ];

  return (
    <View
      style={[styles.modernContainer, { backgroundColor: theme.background }]}
    >
      {/* Modern Header */}
      <View style={styles.modernPageHeader}>
        <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>
          ⚙️ Kong Settings
        </Text>
        <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
          Customize Kong's power
        </Text>
      </View>

      <ScrollView
        style={styles.settingsList}
        showsVerticalScrollIndicator={false}
      >
        {settingGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingGroup}>
            <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>
              {group.title.toUpperCase()}
            </Text>

            {group.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={[
                  styles.modernSettingItem,
                  { backgroundColor: theme.cardBg },
                ]}
              >
                <View style={styles.settingItemContent}>
                  <View
                    style={[
                      styles.settingIconContainer,
                      { backgroundColor: `${theme.primary}15` },
                    ]}
                  >
                    <Text style={styles.settingItemIcon}>{item.icon}</Text>
                  </View>

                  <View style={styles.settingTextContent}>
                    <Text
                      style={[
                        styles.settingItemTitle,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.settingItemSubtitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                  </View>
                </View>

                {item.type === "toggle" && (
                  <TouchableOpacity
                    style={[
                      styles.modernToggleSwitch,
                      {
                        backgroundColor: item.value
                          ? theme.primary
                          : theme.surfaceBg,
                      },
                    ]}
                    onPress={() => item.onToggle(!item.value)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        {
                          transform: [{ translateX: item.value ? 22 : 2 }],
                          backgroundColor: item.value
                            ? "#FFF"
                            : theme.textSecondary,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* About Section */}
        <View style={[styles.aboutSection, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.aboutTitle, { color: theme.textPrimary }]}>
            🦍 About KILL KONG
          </Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            Version 2.0.0 • Built with 🔥 for language warriors{"\n"}
            Powered by Kong's AI • Dominate forever 🦍
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// Modern Chat Page - 백엔드 연결 로직 수정
function ChatPage({ theme, onNavigateToHome }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "assistant",
      content:
        "Yo! 🦍 Kong here! Send me any text and I'll crush it into perfect English! Let's dominate those language skills! 🔥",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    checkConnection();
    // 5초마다 연결 상태 확인 (첫 번째 코드와 동일하게)
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => setKeyboardHeight(event.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isLoading, keyboardHeight]);

  // 첫 번째 코드와 동일한 연결 체크 로직 사용
  const checkConnection = async () => {
    try {
      console.log("🔄 Checking connection to:", BACKEND_URL);
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: "GET",
        timeout: 5000, // AbortSignal 대신 timeout 사용
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Health check success:", data);
        setConnectionStatus(data.ai_ready ? "ready" : "loading");
      } else {
        console.log("❌ Health check failed - HTTP", response.status);
        setConnectionStatus("error");
      }
    } catch (error) {
      console.log("❌ Connection error:", error.message);
      setConnectionStatus("error");
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // 첫 번째 코드와 동일한 연결 체크
    if (connectionStatus !== "ready") {
      Alert.alert(
        "연결 오류",
        `백엔드 서버에 연결할 수 없습니다.\n\n서버: ${BACKEND_URL}\n\n해결방법:\n1. 백엔드 서버 실행 확인\n2. 같은 Wi-Fi 연결 확인\n3. 재연결 버튼 클릭`
      );
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // 첫 번째 코드와 동일한 API 호출
      const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          show_hints: false, // 기본적으로 hints 비활성화
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
        hints: data.hints,
        processingTime: data.processing_time,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "error",
        content: `연결 오류: ${error.message}\n\n서버: ${BACKEND_URL}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.modernChatContainer,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.modernMessagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {messages.map((message) => {
          const isUser = message.type === "user";
          const isError = message.type === "error";

          return (
            <View
              key={message.id}
              style={[
                styles.modernMessageContainer,
                isUser && styles.userMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.modernMessageBubble,
                  {
                    backgroundColor: isUser
                      ? theme.primary
                      : isError
                        ? `${theme.error}15`
                        : theme.cardBg,
                    borderColor: isError ? theme.error : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modernMessageText,
                    {
                      color: isUser
                        ? "#FFF"
                        : isError
                          ? theme.error
                          : theme.textPrimary,
                    },
                  ]}
                >
                  {message.content}
                </Text>

                {/* Hints 표시 (첫 번째 코드와 유사하게) */}
                {message.hints && message.hints.length > 0 && (
                  <View
                    style={[
                      styles.hintsContainer,
                      {
                        backgroundColor: `${theme.accent}10`,
                        borderColor: `${theme.accent}30`,
                      },
                    ]}
                  >
                    <Text style={[styles.hintsTitle, { color: theme.accent }]}>
                      💡 Kong Hints
                    </Text>
                    {message.hints.map((hint, index) => (
                      <View
                        key={index}
                        style={[
                          styles.hintItem,
                          { backgroundColor: theme.cardBg },
                        ]}
                      >
                        <Text style={styles.hintText}>
                          <Text
                            style={[styles.konglish, { color: theme.error }]}
                          >
                            "{hint.konglish}"
                          </Text>
                          <Text> → </Text>
                          <Text
                            style={[styles.natural, { color: theme.success }]}
                          >
                            "{hint.natural}"
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Modern Typing Indicator */}
        {isLoading && (
          <View style={styles.typingIndicator}>
            <View
              style={[styles.typingBubble, { backgroundColor: theme.cardBg }]}
            >
              <View style={styles.typingDots}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.typingDot,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.typingText, { color: theme.textSecondary }]}>
                Kong is crushing...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modern Input */}
      <View
        style={[
          styles.modernInputContainer,
          {
            backgroundColor: theme.navBg,
            bottom:
              keyboardHeight > 0 ? keyboardHeight : width <= 768 ? 30 : 20,
          },
        ]}
      >
        <View
          style={[
            styles.modernInputWrapper,
            { backgroundColor: theme.surfaceBg },
          ]}
        >
          <TextInput
            style={[styles.modernInput, { color: theme.textPrimary }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              connectionStatus === "ready"
                ? "Send Kong your text to crush... 🦍"
                : "Connecting to server..."
            }
            placeholderTextColor={theme.textTertiary}
            multiline
            editable={connectionStatus === "ready"}
            onSubmitEditing={(event) => {
              if (!event.nativeEvent.text.includes("\n")) {
                sendMessage();
              }
            }}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.modernSendButton,
            {
              backgroundColor:
                inputText.trim() && connectionStatus === "ready"
                  ? theme.primary
                  : theme.surfaceBg,
              opacity:
                inputText.trim() && connectionStatus === "ready" ? 1 : 0.5,
            },
          ]}
          onPress={sendMessage}
          disabled={
            !inputText.trim() || isLoading || connectionStatus !== "ready"
          }
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.modernSendIcon,
              {
                color:
                  inputText.trim() && connectionStatus === "ready"
                    ? "#FFF"
                    : theme.textTertiary,
              },
            ]}
          >
            {isLoading ? "⏳" : "🔥"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Connection Error */}
      {connectionStatus === "error" && (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor: `${theme.error}15`,
              borderColor: theme.error,
            },
          ]}
        >
          <Text style={[styles.errorText, { color: theme.error }]}>
            Kong lost connection. Tap to retry.
          </Text>
          <TouchableOpacity onPress={checkConnection}>
            <Text style={[styles.retryText, { color: theme.error }]}>🔄</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
