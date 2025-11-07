# Vera - Mobile Technical Assignment

A React Native mobile application built with Expo that allows users to enter clinical questions and receive AI-generated responses via Server-Sent Events (SSE) streaming. The app displays responses in real-time with support for structured markdown content and collapsible sections.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Expo CLI** (will be installed automatically with dependencies)
- For iOS development: **Xcode** and **iOS Simulator** (macOS only)
- For Android development: **Android Studio** and **Android Emulator**

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/0xGoenka/vera
   cd vera
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will install all required dependencies including Expo, React Native, and project-specific packages.

## Running the App Locally

### Start the Development Server

```bash
npm start
```

or

```bash
npx expo start
```

This will start the Expo development server and display a QR code in your terminal.

### Run on Different Platforms

**iOS Simulator** (macOS only):

```bash
npm run ios
```

or press `i` in the Expo CLI

**Android Emulator**:

```bash
npm run android
```

or press `a` in the Expo CLI

**Web Browser**:

```bash
npm run web
```

or press `w` in the Expo CLI

> **Important for Web Development**: When running on web, you need to start a local proxy server to avoid CORS issues. In a separate terminal, run:
>
> ```bash
> node __dev__/proxy.js
> ```
>
> The proxy will run on `http://localhost:3001` and forward requests to the API. Keep this running while developing on web.

### Using Expo Go (Mobile Device)

1. Install the **Expo Go** app on your iOS or Android device
2. Scan the QR code displayed in the terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Project Structure

```
vera/
├── app/                    # Main application screens (Expo Router)
│   ├── index.tsx          # Home screen with streaming UI
│   └── _layout.tsx        # Root layout configuration
├── components/             # Reusable UI components
│   └── ui/                # UI components (Input, Header, Collapsible, etc.)
├── constants/             # Design system constants (colors, spacing)
├── config/                # Configuration files (API URLs)
├── domain/                # Business logic and services
│   └── services/         # Stream service and API integration
├── utils/                 # Utility functions
└── package.json           # Dependencies and scripts
```

## Key Features

- **Real-time Streaming**: Server-Sent Events (SSE) for incremental response rendering
- **Structured Content**: Automatic detection and rendering of tagged sections (`<guideline>`, `<drug>`, etc.)
- **Collapsible Sections**: Interactive collapsible UI for structured content
- **Search Progress**: Dynamic display of search steps and progress updates
- **Markdown Rendering**: Full markdown support for formatted text
- **Cross-platform**: Runs on iOS, Android, and Web

## Testing

Run the test suite:

```bash
npm test
```

The project includes comprehensive unit tests for the stream service using Jest.

## Linting

Check code quality:

```bash
npm run lint
```

## Architecture Highlights

- **State Management**: Uses `micro-observables` for reactive state management
- **Streaming**: Custom `StreamService` handles SSE parsing and content organization
- **Type Safety**: Full TypeScript implementation with discriminated unions
- **Performance**: Optimized rendering with memoization and efficient list rendering
- **Error Handling**: Comprehensive error handling and user feedback

## API Configuration

The app connects to the streaming API endpoint:

```
https://vera-assignment-api.vercel.app/api/stream?prompt=your-question-here
```

For local development with CORS issues, a proxy configuration is available in the API config.

## Development Notes

- The app uses Expo Router for file-based routing
- Styled-components is used for styling with a centralized design system
- All streaming logic is handled in `domain/services/stream/`
- The UI components are located in `components/ui/` and follow a consistent design pattern

## Troubleshooting

**Metro bundler issues**: Clear cache with `npx expo start -c`

**Dependency issues**: Delete `node_modules` and `package-lock.json`, then run `npm install`

**iOS build issues**: Ensure Xcode Command Line Tools are installed: `xcode-select --install`

**Android build issues**: Ensure Android SDK and emulator are properly configured in Android Studio
