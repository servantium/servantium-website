# Flutter Login Screen

Design reference: https://test.servantium.com/preview/login3/

## Files

```
flutter/
  login_screen.dart          # Drop-in SignInScreen with branded builders
  assets/
    logo.png                 # Servantium logo (dark, for form header on mobile)
    logo_white.png           # Servantium logo (for side panel — or use ColorFiltered)
    astronaut_waving.svg     # Mascot: waving variant
    astronaut_cowboy.svg     # Mascot: cowboy hat + lasso
    astronaut_detective.svg  # Mascot: deerstalker + magnifying glass
    astronaut_captain.svg    # Mascot: captain cap + telescope
    astronaut_professor.svg  # Mascot: mortarboard + book
```

## Setup

1. Copy `login_screen.dart` into your `lib/` directory
2. Copy `assets/` into your project root
3. Add to `pubspec.yaml`:

```yaml
dependencies:
  firebase_ui_auth: ^1.15.0
  # firebase_ui_oauth_google: ^1.3.0  # when Google SSO is ready
  google_fonts: ^6.0.0
  flutter_svg: ^2.0.0

flutter:
  assets:
    - assets/logo.png
    - assets/logo_white.png
    - assets/astronaut_waving.svg
    - assets/astronaut_cowboy.svg
    - assets/astronaut_detective.svg
    - assets/astronaut_captain.svg
    - assets/astronaut_professor.svg
```

4. Apply the theme in your `MaterialApp`:

```dart
MaterialApp(
  theme: servantiumLightTheme(),
  // ...
)
```

5. Navigate to the login screen:

```dart
Navigator.push(context, MaterialPageRoute(
  builder: (_) => const ServantiumLoginScreen(),
));
```

## What the theme controls

firebase_ui_auth reads from ThemeData for form styling:

| ThemeData property | What it styles |
|---|---|
| `inputDecorationTheme` | Email/password field borders, padding, focus ring |
| `elevatedButtonTheme` | "Sign In" submit button (green, filled) |
| `outlinedButtonTheme` | "Sign in with Google" button (bordered) |
| `textButtonTheme` | "Forgot password?" link (green text) |
| `colorScheme.primary` | Focus rings, selection handles, links |

## Reskinning limitations

firebase_ui_auth renders its own internal widget tree. The theme handles most of it, but for pixel-perfect control over the divider ("or"), spacing, and layout you'd need to replace `SignInScreen` with `AuthFlowBuilder` and build a fully custom form. The current approach gets you 90% there.

## Flutter SDK requirement

Uses `Color.withOpacity()` which works on all Flutter versions. If you upgrade to Flutter 3.27+, you can optionally switch to `Color.withValues(alpha:)`.
