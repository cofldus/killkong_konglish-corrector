import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Base Container
  container: {
    flex: 1,
  },

  // Main Content Area
  mainContent: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
  },

  // ===== FLOATING TOP NAVIGATION (Desktop/Tablet) =====
  floatingTopNav: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    borderRadius: 35,
    borderWidth: 1,
    zIndex: 1000,
    backdropFilter: "blur(20px)",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    elevation: 5,
  },

  logoEmoji: {
    fontSize: 24,
  },

  logoText: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  navPills: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 25,
    padding: 4,
    flex: 2,
    justifyContent: "center",
  },

  navPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 2,
    minWidth: 90,
    justifyContent: "center",
  },

  navPillActive: {
    elevation: 8,
    shadowColor: "#0F4C75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  navPillIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  navPillLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  topNavActions: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },

  modernToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  toggleIcon: {
    fontSize: 20,
  },

  // ===== FLOATING BOTTOM NAVIGATION (Mobile) =====
  floatingBottomNav: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 35,
    borderWidth: 1,
    zIndex: 1000,
    backdropFilter: "blur(20px)",
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
  },

  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },

  bottomNavItemActive: {
    // Active state handled by icon container
  },

  bottomNavIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  bottomNavIconActive: {
    elevation: 10,
    shadowColor: "#0F4C75",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  bottomNavIcon: {
    fontSize: 20,
  },

  bottomNavLabel: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  // ===== MODERN CONTAINER STYLES =====
  modernContainer: {
    flex: 1,
  },

  modernContentContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },

  modernPageHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: -1,
  },

  pageSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
  },

  // ===== MODERN HERO SECTION =====
  modernHero: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    position: "relative",
    alignItems: "center",
  },

  floatingElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    zIndex: 1,
  },

  floatingCard: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 20,
    top: 20,
    left: 40,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 40,
    zIndex: 2,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },

  heroContent: {
    alignItems: "center",
    zIndex: 2,
  },

  modernAppIcon: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },

  iconGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    zIndex: 1,
  },

  heroIcon: {
    fontSize: 64,
    zIndex: 2,
  },

  heroText: {
    alignItems: "center",
    marginBottom: 40,
  },

  heroTitle: {
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -2,
  },

  heroSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },

  heroDescription: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },

  // ===== MODERN CTA BUTTON =====
  modernCTA: {
    width: "100%",
    maxWidth: 320,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    elevation: 15,
    shadowColor: "#0F4C75",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },

  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
  },

  ctaText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
  },

  ctaIcon: {
    fontSize: 24,
    fontWeight: "700",
  },

  ctaGlow: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 40,
    zIndex: -1,
  },

  // ===== TRENDING SECTION =====
  trendingSection: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  sectionHeader: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
  },

  trendingGrid: {
    gap: 16,
  },

  trendingCard: {
    padding: 24,
    borderRadius: 24,
    position: "relative",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },

  trendingCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  trendingIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  trendingIconText: {
    fontSize: 24,
  },

  trendBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  trendBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  trendingCategory: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  trendingText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    marginBottom: 16,
    fontStyle: "italic",
  },

  trendingFooter: {
    alignItems: "flex-end",
  },

  tryText: {
    fontSize: 14,
    fontWeight: "700",
  },

  cardGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 26,
    zIndex: -1,
  },

  // ===== FEATURES SECTION =====
  featuresSection: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  modernFeaturesGrid: {
    marginTop: 24,
    gap: 16,
  },

  modernFeatureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    marginBottom: 12,
  },

  featureIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  featureIconText: {
    fontSize: 28,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },

  featureDesc: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    opacity: 0.8,
  },

  featureStats: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // ===== MODERN DEMO SECTION =====
  modernDemoSection: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  demoCard: {
    padding: 32,
    borderRadius: 28,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },

  demoHeader: {
    alignItems: "center",
    marginBottom: 32,
  },

  demoTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },

  demoSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
  },

  demoFlow: {
    alignItems: "center",
  },

  demoStep: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },

  demoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },

  demoBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  demoTextBubble: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    width: "90%",
  },

  demoText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },

  demoArrow: {
    alignItems: "center",
    marginVertical: 16,
  },

  arrowContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#0F4C75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  arrowText: {
    fontSize: 24,
    fontWeight: "700",
  },

  // ===== HISTORY PAGE STYLES =====
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },

  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  historyList: {
    flex: 1,
    paddingHorizontal: 24,
  },

  modernHistoryCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  historyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  timeText: {
    fontSize: 12,
    fontWeight: "500",
  },

  historyComparison: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  beforeSection: {
    flex: 1,
    marginRight: 12,
  },

  beforeText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
  },

  comparisonArrow: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 8,
  },

  afterSection: {
    flex: 1,
    marginLeft: 12,
  },

  afterText: {
    fontSize: 14,
    fontWeight: "600",
  },

  improvementsBadge: {
    alignSelf: "flex-start",
  },

  improvementsText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // ===== SETTINGS PAGE STYLES =====
  settingsList: {
    flex: 1,
    paddingHorizontal: 24,
  },

  settingGroup: {
    marginBottom: 32,
  },

  groupTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  modernSettingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  settingItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  settingItemIcon: {
    fontSize: 24,
  },

  settingTextContent: {
    flex: 1,
  },

  settingItemTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },

  settingItemSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },

  modernToggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
  },

  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  aboutSection: {
    padding: 24,
    borderRadius: 20,
    marginTop: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  aboutTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },

  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },

  // ===== CHAT PAGE STYLES =====
  modernChatContainer: {
    flex: 1,
  },

  modernMessagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  modernMessageContainer: {
    marginBottom: 16,
    alignItems: "flex-start",
  },

  userMessageContainer: {
    alignItems: "flex-end",
  },

  modernMessageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
  },

  modernMessageText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },

  // Modern Typing Indicator
  typingIndicator: {
    marginBottom: 16,
    alignItems: "flex-start",
  },

  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    opacity: 0.6,
  },

  typingText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
  },

  // Modern Input Container
  modernInputContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    backdropFilter: "blur(20px)",
  },

  modernInputWrapper: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: "center",
  },

  modernInput: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    maxHeight: 96,
  },

  modernSendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  modernSendIcon: {
    fontSize: 20,
    fontWeight: "700",
  },

  // Error Banner
  errorBanner: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    zIndex: 1000,
  },

  errorText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },

  retryText: {
    fontSize: 18,
    fontWeight: "700",
  },

  // ===== SPACING =====
  bottomSpacing: {
    height: width <= 768 ? 120 : 40,
  },

  // ===== RESPONSIVE UTILITIES =====
  mobileOnly: {
    display: width <= 768 ? "flex" : "none",
  },

  tabletUp: {
    display: width > 768 ? "flex" : "none",
  },

  // ===== ANIMATION HELPERS =====
  fadeIn: {
    opacity: 1,
  },

  fadeOut: {
    opacity: 0,
  },

  scaleUp: {
    transform: [{ scale: 1.05 }],
  },

  scaleDown: {
    transform: [{ scale: 0.95 }],
  },

  // ===== GLASS MORPHISM EFFECTS =====
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  glassDark: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  // ===== GRADIENT BACKGROUNDS =====
  primaryGradient: {
    backgroundColor: "#0F4C75",
  },

  secondaryGradient: {
    backgroundColor: "#003D82",
  },

  accentGradient: {
    backgroundColor: "#1E88E5",
  },

  // ===== TEXT STYLES =====
  displayLarge: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 52,
  },

  displayMedium: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 40,
  },

  displaySmall: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 32,
  },

  headlineLarge: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },

  headlineMedium: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
  },

  headlineSmall: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },

  titleLarge: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },

  titleMedium: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },

  titleSmall: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  bodyLarge: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },

  bodyMedium: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },

  bodySmall: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },

  labelLarge: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  labelMedium: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  labelSmall: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // ===== ELEVATION LEVELS =====
  elevation1: {
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  elevation2: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  elevation3: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  elevation4: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  elevation5: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  elevation6: {
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
  },

  // ===== BORDER RADIUS =====
  roundedXS: {
    borderRadius: 4,
  },

  roundedSM: {
    borderRadius: 8,
  },

  roundedMD: {
    borderRadius: 12,
  },

  roundedLG: {
    borderRadius: 16,
  },

  roundedXL: {
    borderRadius: 20,
  },

  rounded2XL: {
    borderRadius: 24,
  },

  rounded3XL: {
    borderRadius: 32,
  },

  roundedFull: {
    borderRadius: 9999,
  },

  // ===== SPACING UTILITIES =====
  m0: { margin: 0 },
  m1: { margin: 4 },
  m2: { margin: 8 },
  m3: { margin: 12 },
  m4: { margin: 16 },
  m5: { margin: 20 },
  m6: { margin: 24 },
  m8: { margin: 32 },
  m10: { margin: 40 },
  m12: { margin: 48 },

  p0: { padding: 0 },
  p1: { padding: 4 },
  p2: { padding: 8 },
  p3: { padding: 12 },
  p4: { padding: 16 },
  p5: { padding: 20 },
  p6: { padding: 24 },
  p8: { padding: 32 },
  p10: { padding: 40 },
  p12: { padding: 48 },

  // ===== FLEX UTILITIES =====
  flexRow: {
    flexDirection: "row",
  },

  flexCol: {
    flexDirection: "column",
  },

  itemsCenter: {
    alignItems: "center",
  },

  itemsStart: {
    alignItems: "flex-start",
  },

  itemsEnd: {
    alignItems: "flex-end",
  },

  justifyCenter: {
    justifyContent: "center",
  },

  justifyBetween: {
    justifyContent: "space-between",
  },

  justifyAround: {
    justifyContent: "space-around",
  },

  justifyEvenly: {
    justifyContent: "space-evenly",
  },

  flex1: {
    flex: 1,
  },

  flexNone: {
    flex: 0,
  },

  // ===== POSITION UTILITIES =====
  absolute: {
    position: "absolute",
  },

  relative: {
    position: "relative",
  },

  inset0: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  zIndex0: {
    zIndex: 0,
  },

  zIndex10: {
    zIndex: 10,
  },

  zIndex20: {
    zIndex: 20,
  },

  zIndex50: {
    zIndex: 50,
  },

  zIndex100: {
    zIndex: 100,
  },

  // ===== OPACITY UTILITIES =====
  opacity0: {
    opacity: 0,
  },

  opacity25: {
    opacity: 0.25,
  },

  opacity50: {
    opacity: 0.5,
  },

  opacity75: {
    opacity: 0.75,
  },

  opacity100: {
    opacity: 1,
  },

  // ===== OVERFLOW UTILITIES =====
  overflowHidden: {
    overflow: "hidden",
  },

  overflowVisible: {
    overflow: "visible",
  },
});

export default styles;
