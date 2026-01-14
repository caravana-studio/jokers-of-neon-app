import UIKit
import Capacitor
import FBSDKCoreKit
import AppsFlyerLib
import FirebaseCore
import FirebaseMessaging
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Facebook SDK
        ApplicationDelegate.shared.application(
            application,
            didFinishLaunchingWithOptions: launchOptions
        )
        // Configure AppsFlyer SDK
        configureAppsFlyer()

        // Firebase
        FirebaseApp.configure()

        // Notifications delegate (helps foreground presentation)
        UNUserNotificationCenter.current().delegate = self

        // Force linker to include AppsFlyerBridge plugin
        _ = AppsFlyerBridge.self

        return true
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Activate Facebook events
        AppEvents.shared.activateApp()

        // Start AppsFlyer SDK - must be called every time app becomes active
        AppsFlyerLib.shared().start()
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        AppEvents.shared.activateApp()
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        // Handle AppsFlyer deep links (URI schemes)
        AppsFlyerLib.shared().handleOpen(url, options: options)

        // Handle Facebook and Capacitor
        let handledByFB = ApplicationDelegate.shared.application(app, open: url, options: options)
        let handledByCap = ApplicationDelegateProxy.shared.application(app, open: url, options: options)

        return handledByFB || handledByCap
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        // Handle AppsFlyer Universal Links
        AppsFlyerLib.shared().continue(userActivity, restorationHandler: nil)

        return ApplicationDelegateProxy.shared.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }

    // MARK: - AppsFlyer Configuration
    private func configureAppsFlyer() {
        let appsFlyer = AppsFlyerLib.shared()

        // Set credentials
        appsFlyer.appsFlyerDevKey = "GXf8msjiYkKjdxMjgsb6LU"
        appsFlyer.appleAppID = "6749147020"

        // Set OneLink ID for User Invite feature (MUST be set before start())
        // This enables generating referral links via the SDK
        // Use the OneLink TEMPLATE ID (2BD9), not the shortlink ID
        appsFlyer.appInviteOneLinkID = "2BD9"

        // Set delegates for callbacks
        appsFlyer.delegate = self
        appsFlyer.deepLinkDelegate = self

        // Debug mode (disable in production)
        #if DEBUG
        appsFlyer.isDebug = true
        #endif

        NSLog("[AppsFlyer] SDK configured - DevKey: %@, AppID: %@, OneLinkID: %@",
              appsFlyer.appsFlyerDevKey ?? "nil",
              appsFlyer.appleAppID ?? "nil",
              appsFlyer.appInviteOneLinkID ?? "nil")
    }
}

// MARK: - AppsFlyerLibDelegate (Install Attribution)
extension AppDelegate: AppsFlyerLibDelegate {

    func onConversionDataSuccess(_ installData: [AnyHashable: Any]) {
        NSLog("[AppsFlyer] Conversion data received")

        // Serialize to JSON for JavaScript
        guard let jsonData = try? JSONSerialization.data(withJSONObject: installData),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            NSLog("[AppsFlyer] Failed to serialize conversion data")
            return
        }

        // Send to JavaScript via NotificationCenter → AppsFlyerBridge
        NotificationCenter.default.post(
            name: NSNotification.Name("AppsFlyerConversionData"),
            object: nil,
            userInfo: ["data": jsonString]
        )

        // Log attribution info
        if let status = installData["af_status"] as? String {
            if status == "Non-organic" {
                let source = installData["media_source"] as? String ?? "unknown"
                let campaign = installData["campaign"] as? String ?? "unknown"
                NSLog("[AppsFlyer] Non-organic install - Source: %@, Campaign: %@", source, campaign)
            } else {
                NSLog("[AppsFlyer] Organic install")
            }
        }
    }

    func onConversionDataFail(_ error: Error) {
        NSLog("[AppsFlyer] Conversion data error: %@", error.localizedDescription)

        // Notify JavaScript of error
        NotificationCenter.default.post(
            name: NSNotification.Name("AppsFlyerConversionData"),
            object: nil,
            userInfo: ["error": error.localizedDescription]
        )
    }
}

// MARK: - DeepLinkDelegate (Deep Links & Deferred Deep Links)

extension AppDelegate: DeepLinkDelegate {

    func didResolveDeepLink(_ result: DeepLinkResult) {
        // Handle result status
        switch result.status {
        case .notFound:
            NSLog("[AppsFlyer] Deep link not found")
            return
        case .failure:
            if let error = result.error {
                NSLog("[AppsFlyer] Deep link error: %@", error.localizedDescription)
            }
            return
        case .found:
            NSLog("[AppsFlyer] Deep link found")
        @unknown default:
            NSLog("[AppsFlyer] Unknown deep link status")
            return
        }

        guard let deepLink = result.deepLink else {
            NSLog("[AppsFlyer] Could not extract deep link object")
            return
        }

        // Extract deep link data
        let deepLinkValue = deepLink.deeplinkValue ?? ""
        let isDeferred = deepLink.isDeferred

        NSLog("[AppsFlyer] Deep link value: %@, isDeferred: %@",
              deepLinkValue, isDeferred ? "true" : "false")

        // Build data object to send to JavaScript
        var data: [String: Any] = [
            "deepLinkValue": deepLinkValue,
            "isDeferred": isDeferred
        ]

        // Check if this is a referral link
        // Expected format: deep_link_value = "ref" with ?ref=username parameter
        // Or legacy format with deep_link_sub1/deep_link_sub2
        if deepLinkValue == "referral" || deepLinkValue == "ref" {
            NSLog("[AppsFlyer] Detected referral deep link")
            data["type"] = "referral"

            // Extract referral code - try 'ref' param first (new short format), then fallbacks
            if let referralCode = deepLink.clickEvent["ref"] as? String, !referralCode.isEmpty {
                data["referralCode"] = referralCode
                NSLog("[AppsFlyer] Referral code (ref): %@", referralCode)
            } else if let referralCode = deepLink.clickEvent["deep_link_sub1"] as? String, !referralCode.isEmpty {
                data["referralCode"] = referralCode
                NSLog("[AppsFlyer] Referral code (deep_link_sub1): %@", referralCode)
            } else if let referralCode = deepLink.clickEvent["af_sub1"] as? String, !referralCode.isEmpty {
                data["referralCode"] = referralCode
                NSLog("[AppsFlyer] Referral code (af_sub1): %@", referralCode)
            }

            // Referrer address is no longer needed in the link - backend looks it up from username
            // But still support legacy links that include it
            if let referrerAddress = deepLink.clickEvent["deep_link_sub2"] as? String, !referrerAddress.isEmpty {
                data["referrerAddress"] = referrerAddress
                NSLog("[AppsFlyer] Referrer address (deep_link_sub2): %@", referrerAddress)
            } else if let referrerAddress = deepLink.clickEvent["af_sub2"] as? String, !referrerAddress.isEmpty {
                data["referrerAddress"] = referrerAddress
                NSLog("[AppsFlyer] Referrer address (af_sub2): %@", referrerAddress)
            }

            // Log click event keys for debugging
            NSLog("[AppsFlyer] Click event keys: %@", deepLink.clickEvent.keys.map { String(describing: $0) }.joined(separator: ", "))
        } else {
            // Non-referral deep link - include all click event data
            data["type"] = "deep_link"
            for (key, value) in deepLink.clickEvent {
                if let keyStr = key as? String {
                    data[keyStr] = value
                }
            }
        }

        // Serialize and send to JavaScript
        if let jsonData = try? JSONSerialization.data(withJSONObject: data),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            NotificationCenter.default.post(
                name: NSNotification.Name("AppsFlyerDeepLink"),
                object: nil,
                userInfo: ["data": jsonString]
            )
            NSLog("[AppsFlyer] Deep link data sent to JavaScript")
        }
    }

    // MARK: - Push Notifications (APNs -> Firebase + Capacitor)
    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        // ✅ This is the missing piece for FCM -> APNs routing
        Messaging.messaging().apnsToken = deviceToken

        // Keep Capacitor bridge working too
        NotificationCenter.default.post(
            name: .capacitorDidRegisterForRemoteNotifications,
            object: deviceToken
        )
    }

    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        NotificationCenter.default.post(
            name: .capacitorDidFailToRegisterForRemoteNotifications,
            object: error
        )
    }

    // Optional: show notifications while app is in foreground
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound, .badge])
    }
}
