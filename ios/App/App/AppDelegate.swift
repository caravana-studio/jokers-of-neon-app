import UIKit
import Capacitor
import FBSDKCoreKit
import AppsFlyerLib

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    // MARK: - Application Lifecycle

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Initialize Facebook SDK
        ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)

        // Configure AppsFlyer SDK
        configureAppsFlyer()

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

    // MARK: - URL Handling

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
        appsFlyer.appInviteOneLinkID = "H5hv"

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
        // Expected format: deep_link_value = "referral" or "ref"
        // deep_link_sub1 = referral code (username)
        // deep_link_sub2 = referrer address
        if deepLinkValue == "referral" || deepLinkValue == "ref" {
            data["type"] = "referral"

            // Extract referral code (deep_link_sub1)
            if let referralCode = deepLink.clickEvent["deep_link_sub1"] as? String {
                data["referralCode"] = referralCode
                NSLog("[AppsFlyer] Referral code: %@", referralCode)
            }

            // Extract referrer address (deep_link_sub2)
            if let referrerAddress = deepLink.clickEvent["deep_link_sub2"] as? String {
                data["referrerAddress"] = referrerAddress
                NSLog("[AppsFlyer] Referrer address: %@", referrerAddress)
            }

            // Extract optional attribution data
            if let mediaSource = deepLink.clickEvent["media_source"] as? String {
                data["mediaSource"] = mediaSource
            }
            if let campaign = deepLink.clickEvent["campaign"] as? String {
                data["campaign"] = campaign
            }
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
}
