# Agent Instructions

## Version bump checklist
- Update `src/constants/version.ts` to the new app version (APP_VERSION).
- Android: `android/app/build.gradle`
  - Set `versionName` to the new app version.
  - Increment `versionCode` by 1 (integer, Play Store requires monotonic increases).
- iOS: `ios/App/App.xcodeproj/project.pbxproj`
  - Set `MARKETING_VERSION` to the new app version.
  - Increment `CURRENT_PROJECT_VERSION` by 1 (integer).

## Notes
- `package.json` version is not used for mobile release versioning in this repo.

## Release steps
```sh
npm run build
npx cap sync
npx cap open ios
npx cap open android
```
