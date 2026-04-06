/// Servantium Login Screen
///
/// Drop-in firebase_ui_auth SignInScreen with branded sideBuilder,
/// headerBuilder, and footerBuilder. Matches the design at:
/// https://test.servantium.com/preview/login3/
///
/// SETUP:
///
/// 1. Add dependencies to pubspec.yaml:
///      firebase_ui_auth: ^1.15.0
///      firebase_ui_oauth_google: ^1.3.0
///      google_fonts: ^6.0.0
///      flutter_svg: ^2.0.0
///
/// 2. Copy the assets/ folder next to this file into your project,
///    then declare them in pubspec.yaml:
///      flutter:
///        assets:
///          - assets/logo.png
///          - assets/logo_white.png
///          - assets/astronaut_waving.svg
///          - assets/astronaut_cowboy.svg
///          - assets/astronaut_detective.svg
///          - assets/astronaut_captain.svg
///          - assets/astronaut_professor.svg
///
/// 3. Wrap your MaterialApp with servantiumLightTheme():
///      MaterialApp(
///        theme: servantiumLightTheme(),
///        ...
///      )
///
/// 4. Use:
///      Navigator.push(context, MaterialPageRoute(
///        builder: (_) => const ServantiumLoginScreen(),
///      ));
///
/// NOTES ON RESKINNING:
/// firebase_ui_auth does NOT fully respect ThemeData for its form widgets.
/// It uses its own internal button and layout rendering. To override:
/// - The Sign In button style uses the `styles` parameter on SignInScreen
/// - Input decoration comes from ThemeData.inputDecorationTheme
/// - The "or" divider and Google button need a custom subtitleBuilder
///   or you build your own form with AuthFlowBuilder instead.
///
/// The approach below uses SignInScreen's `styles` map to override the
/// primary submit button, plus ThemeData for inputs. For full pixel-perfect
/// control, consider using AuthFlowBuilder + a completely custom form.

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_ui_auth/firebase_ui_auth.dart';
// Uncomment when Google sign-in is configured:
// import 'package:firebase_ui_oauth_google/firebase_ui_oauth_google.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_svg/flutter_svg.dart';

// ============================================================
// BRAND COLORS
// ============================================================

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
  static const softMint = Color(0xFFE8FBF1);
}

// ============================================================
// LOGIN SCREEN
// ============================================================

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

      // Override the submit button to be green + filled
      styles: const {
        EmailFormStyle(signInButtonVariant: ButtonVariant.filled),
      },

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
// Only rendered by firebase_ui_auth on screens > 800px wide
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
                    Colors.white.withOpacity(0.08),
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
                    Colors.white.withOpacity(0.06),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // Content
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 48),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Logo — use ColorFiltered to make it white
                    ColorFiltered(
                      colorFilter: const ColorFilter.mode(
                        Colors.white,
                        BlendMode.srcATop,
                      ),
                      child: Image.asset(
                        'assets/logo.png',
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
                        color: Colors.white.withOpacity(0.75),
                        height: 1.65,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Astronaut mascot carousel
                    const _AstronautCarousel(),
                    const SizedBox(height: 28),

                    // Testimonial
                    Container(
                      width: double.infinity,
                      constraints: const BoxConstraints(maxWidth: 380),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.08),
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
                              color: Colors.white.withOpacity(0.88),
                              height: 1.6,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '— Business Development, Federal Services',
                            style: GoogleFonts.sourceSans3(
                              fontSize: 12,
                              color: Colors.white.withOpacity(0.55),
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
// Cycles through SVG mascot variants with a crossfade.
// Requires flutter_svg and the SVG files in assets/.
// ============================================================

class _AstronautCarousel extends StatefulWidget {
  const _AstronautCarousel();

  @override
  State<_AstronautCarousel> createState() => _AstronautCarouselState();
}

class _AstronautCarouselState extends State<_AstronautCarousel> {
  static const _svgPaths = [
    'assets/astronaut_waving.svg',
    'assets/astronaut_cowboy.svg',
    'assets/astronaut_detective.svg',
    'assets/astronaut_captain.svg',
    'assets/astronaut_professor.svg',
  ];

  int _current = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (mounted) setState(() => _current = (_current + 1) % _svgPaths.length);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120,
      width: 120,
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 600),
        switchInCurve: Curves.easeOut,
        switchOutCurve: Curves.easeIn,
        child: SvgPicture.asset(
          _svgPaths[_current],
          key: ValueKey(_current),
          width: 100,
          height: 100,
        ),
      ),
    );
  }
}

// ============================================================
// HEADER BUILDER
// Shown above the form. On mobile (side panel hidden),
// also shows the logo.
// ============================================================

class _HeaderBuilder extends StatelessWidget {
  final double shrinkOffset;
  const _HeaderBuilder({required this.shrinkOffset});

  @override
  Widget build(BuildContext context) {
    final isNarrow = MediaQuery.of(context).size.width <= 800;
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        children: [
          if (isNarrow) ...[
            Image.asset(
              'assets/logo.png',
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
// THEME
//
// Apply this to your MaterialApp:
//   MaterialApp(theme: servantiumLightTheme(), ...)
//
// This controls the form field styling, button colors, and
// overall look. firebase_ui_auth reads from ThemeData for:
//   - InputDecorationTheme → form field borders & padding
//   - ElevatedButtonThemeData → "Sign In" button fill color
//   - OutlinedButtonThemeData → "Sign in with Google" button
//   - ColorScheme.primary → accent color (links, focus rings)
// ============================================================

ThemeData servantiumLightTheme() {
  final base = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: ServantiumColors.green,
      primary: ServantiumColors.green,
      brightness: Brightness.light,
    ),
    textTheme: GoogleFonts.sourceSans3TextTheme(),
  );

  return base.copyWith(
    // Form fields: rounded border, green focus ring
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
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.red, width: 1.5),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.red, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      labelStyle: GoogleFonts.sourceSans3(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: ServantiumColors.inkLight,
      ),
    ),

    // "Sign In" button: green, full width, rounded
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
        elevation: 0,
      ),
    ),

    // "Sign in with Google" button: outlined, rounded
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

    // Text buttons (Forgot password, etc): green
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: ServantiumColors.green,
        textStyle: GoogleFonts.sourceSans3(
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
  );
}
