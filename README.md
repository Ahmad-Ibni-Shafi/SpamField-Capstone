# SpamShield

SpamShield is an in-development React Native and Expo application for identifying,
analyzing, and managing potential spam calls and SMS messages.

The planned system uses rule-based detection, configurable filters, repeated-call
analysis, reputation indicators, and local data storage to classify activity.
The MVP now includes the main simulated workflows and local settings.

> **Status:** In development  
> **Platforms:** Android and iOS  
> **License:** MIT

## Implemented MVP

- Bottom-tab dashboard for key application areas
- Simulated call and SMS analysis
- Whitelist, blocklist, prefix, and regex rules
- Repeated-call detection within a 10-minute window
- Phone-number reputation-style score and classification
- Meeting mode and off-time protection switches
- Activity history stored locally with AsyncStorage
- Responsive styling for Android, iOS, and web

## Detection Model

The planned detection pipeline will:

1. Receive a call or SMS event.
2. Normalize the phone number.
3. Check the whitelist.
4. Check the blocklist.
5. Apply prefix and regex rules.
6. Analyze repeated calls.
7. Evaluate available reputation indicators.
8. Assign a classification and risk level.
9. Save the result and update dashboard statistics.

### Classifications

| Classification | Intended meaning |
| --- | --- |
| Trusted | Matches a whitelisted number |
| Spam | Matches strong spam indicators or blocklist rules |
| Suspicious | Matches one or more suspicious patterns |
| Unknown | No significant trusted or spam indicators detected |

These rules are implemented as a local, demonstrational rule-based model.

## Technology

- React Native
- Expo
- JavaScript
- React Navigation
- React Native Paper
- Expo Vector Icons
- React Context and hooks

The navigation, UI components, detection utility, and AsyncStorage persistence
are included in the project.

## Getting Started

### Prerequisites

- Node.js and npm
- Android Studio, Xcode, or Expo Go

### Installation

```bash
git clone https://github.com/Ahmad-Ibni-Shafi/ServiceHub.git
cd SpamShield
npm install
```

### Run the App

```bash
npm start
```

You can also use the platform-specific scripts:

```bash
npm run android
npm run ios
npm run web
```

Scan the displayed QR code with Expo Go, or use an emulator/simulator.

## Build an Installable Android APK

For a standalone APK suitable for a college demo:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

The build runs in Expo's cloud. After it finishes, open the link printed by the
CLI or use the build link in the Expo account dashboard. Download the `.apk`,
transfer it to an Android phone, and tap the file to install it. Android may ask
you to allow installation from your browser or file manager.

## Project Structure

```text
SpamShield/
├── App.js
├── app.json
├── assets/
├── index.js
├── package.json
├── README.md
└── src/
    ├── components/
    │   ├── Card.js
    │   └── ScreenTitle.js
    ├── screens/
    │   ├── Dashboard/
    │   ├── Activity/
    │   ├── NumberChecker/
    │   ├── Rules/
    │   └── Settings/
    ├── navigation/
    │   └── AppNavigator.js
    ├── context/
    │   └── AppContext.js
    ├── services/
    │   └── detectionService.js
    ├── database/
    │   └── storageService.js
    ├── hooks/
    │   └── useAppState.js
    └── utils/
        └── spamDetector.js
```

The main implementation is organized between the application screens in
[App.js](App.js) and the detection utility in
[src/utils/spamDetector.js](src/utils/spamDetector.js).

## Current Scope

This project provides a working Expo MVP. It does not yet:

- Read real incoming calls or SMS messages
- Block or reject calls and messages
- Detect spam using a machine-learning model
- Query a live phone-number reputation service

Expo applications cannot natively manage calls or SMS without additional
platform-specific implementation and appropriate operating-system permissions.

## Development Roadmap

- [x] Build the primary navigation structure
- [x] Create the dashboard and activity screens
- [x] Add simulated call and SMS events
- [x] Implement whitelist and blocklist management
- [x] Add prefix and regex filtering
- [x] Implement repeated-call detection
- [x] Add meeting mode and off-time switches
- [x] Add local data persistence
- [x] Add analytics and detection history
- [ ] Add automated tests

## Contributing

Contributions should preserve the separation between presentation, detection
logic, state management, and local data access. Before submitting a change,
verify that it builds and runs on the supported platforms.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
# SpamField-Capstone
