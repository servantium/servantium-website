/// Servantium Login Screen
///
/// Drop-in firebase_ui_auth SignInScreen with branded sideBuilder,
/// headerBuilder, and footerBuilder. Matches the design at:
/// https://test.servantium.com/preview/login3/
///
/// DEPENDENCIES (pubspec.yaml):
///   firebase_ui_auth: ^1.15.0
///   firebase_ui_oauth_google: ^1.3.0  (for Google SSO)
///   google_fonts: ^6.0.0
///
/// ASSETS:
///   - assets/images/logo_white.png  (Servantium logo, white version)
///   - assets/images/logo.png        (Servantium logo, dark version)
///
/// USAGE:
///   Navigator.push(context, MaterialPageRoute(
///     builder: (_) => const ServantiumLoginScreen(),
///   ));

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_ui_auth/firebase_ui_auth.dart';
// Uncomment when google sign-in is configured:
// import 'package:firebase_ui_oauth_google/firebase_ui_oauth_google.dart';
import 'package:google_fonts/google_fonts.dart';

/// Servantium brand colors
class ServantiumColors {
  static const green = Color(0xFF00C26D);
  static const greenHover = Color(0xFF00A95E);
  static const deepForest = Color(0xFF023E25);
  static const emerald = Color(0xFF037A47);
  static const ink = Color(0xFF0D0D0D);
  static const inkLight = Color(0xFF3D3D3D);
  static const inkMuted = Color(0xFF6B6B6B);
  static const cloudGrey = Color(0xFFE1E3E6);
  static const mistGrey = Color(0xFFF5F6F7);
}

class ServantiumLoginScreen extends StatelessWidget {
  const ServantiumLoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SignInScreen(
      providers: [
        EmailAuthProvider(),
        // Uncomment when Google OAuth is configured:
        // GoogleProvider(clientId: 'YOUR_GOOGLE_CLIENT_ID'),
      ],
      sideBuilder: (context, constraints) {
        return const _SidePanel();
      },
      headerBuilder: (context, constraints, shrinkOffset) {
        return _HeaderBuilder(shrinkOffset: shrinkOffset);
      },
      footerBuilder: (context, action) {
        return const _FooterBuilder();
      },
    );
  }
}

// ============================================================
// SIDE PANEL (sideBuilder)
// Only rendered on screens wider than ~800px by firebase_ui_auth
// ============================================================

class _SidePanel extends StatelessWidget {
  const _SidePanel();

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints.expand(),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment(-0.3, -1.0),
          end: Alignment(0.3, 1.0),
          colors: [
            ServantiumColors.green,
            ServantiumColors.emerald,
            ServantiumColors.deepForest,
          ],
          stops: [0.0, 0.4, 1.0],
        ),
      ),
      child: Stack(
        children: [
          // Decorative orbs
          Positioned(
            top: -40,
            right: -60,
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    Colors.white.withValues(alpha: 0.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            bottom: -30,
            left: -50,
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    Colors.white.withValues(alpha: 0.06),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          // Content
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 48),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Logo
                    Image.asset(
                      'assets/images/logo_white.png',
                      height: 48,
                      errorBuilder: (_, __, ___) => Text(
                        'SERVANTIUM',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 28,
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                          letterSpacing: 2,
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Title
                    Text(
                      'The operating system\nfor services teams.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 28,
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Subtitle
                    Text(
                      'Your hub to scope, price, deliver and learn from every project.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.sourceSans3(
                        fontSize: 16,
                        color: Colors.white.withValues(alpha: 0.75),
                        height: 1.65,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Astronaut mascot (animated carousel)
                    const _AstronautCarousel(),
                    const SizedBox(height: 28),

                    // Testimonial quote
                    Container(
                      width: double.infinity,
                      constraints: const BoxConstraints(maxWidth: 380),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '"Servantium makes turning around quotes and invoices faster than ever."',
                            style: GoogleFonts.sourceSans3(
                              fontSize: 14,
                              fontStyle: FontStyle.italic,
                              color: Colors.white.withValues(alpha: 0.88),
                              height: 1.6,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '— Business Development, Federal Services',
                            style: GoogleFonts.sourceSans3(
                              fontSize: 12,
                              color: Colors.white.withValues(alpha: 0.55),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// ASTRONAUT CAROUSEL
// Cycles through mascot variants with a crossfade animation.
// Replace the placeholder icons with your actual SVG/Lottie
// astronaut assets once they're in the Flutter project.
// ============================================================

class _AstronautCarousel extends StatefulWidget {
  const _AstronautCarousel();

  @override
  State<_AstronautCarousel> createState() => _AstronautCarouselState();
}

class _AstronautCarouselState extends State<_AstronautCarousel> {
  static const _variants = [
    _AstronautVariant(Icons.waving_hand, 'Waving'),
    _AstronautVariant(Icons.explore, 'Explorer'),
    _AstronautVariant(Icons.search, 'Detective'),
    _AstronautVariant(Icons.sailing, 'Captain'),
    _AstronautVariant(Icons.school, 'Professor'),
  ];

  int _current = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (mounted) setState(() => _current = (_current + 1) % _variants.length);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final variant = _variants[_current];
    return SizedBox(
      height: 140,
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 600),
        switchInCurve: Curves.easeOut,
        switchOutCurve: Curves.easeIn,
        child: Column(
          key: ValueKey(_current),
          mainAxisSize: MainAxisSize.min,
          children: [
            // TODO: Replace with actual SVG astronaut assets
            // e.g. SvgPicture.asset('assets/astronaut/${variant.name}.svg')
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(
                variant.icon,
                size: 48,
                color: Colors.white.withValues(alpha: 0.9),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _AstronautVariant {
  final IconData icon;
  final String label;
  const _AstronautVariant(this.icon, this.label);
}

// ============================================================
// HEADER BUILDER
// Shows above the form. On mobile (when sideBuilder is hidden),
// also shows the logo.
// ============================================================

class _HeaderBuilder extends StatelessWidget {
  final double shrinkOffset;
  const _HeaderBuilder({required this.shrinkOffset});

  @override
  Widget build(BuildContext context) {
    final isNarrow = MediaQuery.sizeOf(context).width <= 800;
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        children: [
          if (isNarrow) ...[
            Image.asset(
              'assets/images/logo.png',
              height: 32,
              errorBuilder: (_, __, ___) => Text(
                'SERVANTIUM',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.w500,
                  color: ServantiumColors.ink,
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
          Text(
            'Welcome back',
            style: GoogleFonts.playfairDisplay(
              fontSize: 28,
              fontWeight: FontWeight.w500,
              color: ServantiumColors.ink,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Sign in to continue to Servantium',
            style: GoogleFonts.sourceSans3(
              fontSize: 15,
              color: ServantiumColors.inkMuted,
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// FOOTER BUILDER
// Shows below the form with the sign-up link.
// ============================================================

class _FooterBuilder extends StatelessWidget {
  const _FooterBuilder();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "Don't have an account? ",
            style: GoogleFonts.sourceSans3(
              fontSize: 14,
              color: ServantiumColors.inkMuted,
            ),
          ),
          GestureDetector(
            onTap: () {
              // TODO: Navigate to contact/registration page
            },
            child: Text(
              'Contact us',
              style: GoogleFonts.sourceSans3(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: ServantiumColors.green,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// THEME HELPER
// Use this ThemeData in your MaterialApp to match the design.
// ============================================================

ThemeData servantiumLightTheme() {
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: ServantiumColors.green,
      brightness: Brightness.light,
    ),
    textTheme: GoogleFonts.sourceSans3TextTheme(),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: ServantiumColors.cloudGrey, width: 1.5),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: ServantiumColors.cloudGrey, width: 1.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: ServantiumColors.green, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      labelStyle: GoogleFonts.sourceSans3(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: ServantiumColors.inkLight,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: ServantiumColors.green,
        foregroundColor: Colors.white,
        minimumSize: const Size.fromHeight(48),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        textStyle: GoogleFonts.sourceSans3(
          fontSize: 15,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: ServantiumColors.inkLight,
        minimumSize: const Size.fromHeight(44),
        side: const BorderSide(color: ServantiumColors.cloudGrey, width: 1.5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        textStyle: GoogleFonts.sourceSans3(
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
  );
}
