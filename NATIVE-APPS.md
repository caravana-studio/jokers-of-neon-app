## Native App Release Guide

Follow the steps below to prep, build, and ship the Capacitor-powered iOS and Android apps.

### 1. Prerequisites
- Install the latest **Xcode** from the Mac App Store (includes simulators, command-line tools, and signing utilities).
- Install **Android Studio** with the required SDK platforms, build tools, and an Android Virtual Device if you need to test locally.
- Make sure you can run Capacitor commands (`npm install` has already added them locally).

### 2. Build the Web Assets
From the project root:
```sh
npm run build          # Produces fresh web assets in dist/
npx cap copy           # Copies those assets into ios/ and android/
```

### 3. iOS Release Build
```sh
npx cap open ios       # Launches the Xcode workspace
```
In Xcode:
1. Select the **Any iOS Device (arm64)** scheme (or a specific device) to enable archiving.
2. Ensure the **Signing & Capabilities** tab has the correct team, bundle id, and provisioning profile.
3. Use the menu **Product → Archive** and wait for the build to finish in the Organizer.
4. In Organizer, click **Distribute App**, choose **App Store Connect**, follow the prompts, and let Xcode upload the archive.

### 4. Android Release Build
```sh
npx cap open android   # Launches the Android Studio project
```
In Android Studio:
1. Open **Build → Generate Signed App Bundle / APK…**.
2. Pick **Android App Bundle** (.aab) as the target format.
3. Either select an existing keystore or create one, fill in passwords, alias, and validity period.
4. Choose **release** as the build variant, then click **Create** (Finish) to produce the signed bundle under `android/app/build/outputs/bundle/release/`.
5. Upload the resulting `.aab` to **Google Play Console → Production → Create new release**, attach release notes, complete checks, and roll out.

### 5. Quick Checklist
- [ ] `npm run build` succeeds with up-to-date dependencies.
- [ ] `npx cap copy` runs without errors.
- [ ] iOS archive uploaded via Xcode Organizer.
- [ ] Android `.aab` uploaded and the release is rolled out (or staged) in Play Console.
