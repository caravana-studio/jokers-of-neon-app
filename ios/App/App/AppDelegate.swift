import UIKit
import Capacitor
import FBSDKCoreKit
import AppsFlyerLib

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        ApplicationDelegate.shared.application(
            application,
            didFinishLaunchingWithOptions: launchOptions
        )
        
        // Configure AppsFlyer
        AppsFlyerLib.shared().appsFlyerDevKey = "GXf8msjiYkKjdxMjgsb6LU"
        AppsFlyerLib.shared().appleAppID = "6749147020"
        AppsFlyerLib.shared().deepLinkDelegate = self
        
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        AppEvents.shared.activateApp()
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        AppEvents.shared.activateApp()
        AppsFlyerLib.shared().start()
    }

    func applicationWillTerminate(_ application: UIApplication) { }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey : Any] = [:]
    ) -> Bool {
        // Handle AppsFlyer deep links (URI schemes)
        AppsFlyerLib.shared().handleOpen(url, options: options)
        
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
        
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}

extension AppDelegate: AppsFlyerLibDelegate {

    func onConversionDataSuccess(_ installData: [AnyHashable: Any]) {
        print("[AppsFlyer] Conversion data received")
        
        // Convert install data to JSON string for JavaScript
        guard let jsonData = try? JSONSerialization.data(withJSONObject: installData),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            print("[AppsFlyer] Failed to serialize conversion data")
            return
        }
        
        // Send to JavaScript via NotificationCenter (will be picked up by Capacitor)
        NotificationCenter.default.post(
            name: NSNotification.Name("AppsFlyerConversionData"),
            object: nil,
            userInfo: ["data": jsonString, "type": "conversion"]
        )
        
        // Log for debugging
        if let status = installData["af_status"] as? String {
            if status == "Non-organic" {
                if let sourceID = installData["media_source"],
                   let campaign = installData["campaign"] {
                    print("[AppsFlyer] Non-organic install. Media source: \(sourceID) Campaign: \(campaign)")
                }
            } else {
                print("[AppsFlyer] Organic install")
            }
        }
    }

    func onConversionDataFail(_ error: Error) {
        print("[AppsFlyer] Conversion data error: \(error.localizedDescription)")
        
        // Send error to JavaScript
        NotificationCenter.default.post(
            name: NSNotification.Name("AppsFlyerConversionData"),
            object: nil,
            userInfo: ["error": error.localizedDescription, "type": "conversion_error"]
        )
    }
}


extension AppDelegate: DeepLinkDelegate {
     
    func didResolveDeepLink(_ result: DeepLinkResult) {
        switch result.status {
        case .notFound:
            NSLog("[AppsFlyer] Deep link not found")
            return
        case .failure:
            if let error = result.error {
                print("[AppsFlyer] Deep link error: \(error.localizedDescription)")
            }
            return
        case .found:
            NSLog("[AppsFlyer] Deep link found")
        }
        
        guard let deepLinkObj = result.deepLink else {
            NSLog("[AppsFlyer] Could not extract deep link object")
            return
        }
        
        // Extract referral data for Jokers of Neon
        // Expected parameters:
        // - deep_link_value: "referral" (indicates this is a referral link)
        // - deep_link_sub1: referral_code (the referral code)
        // - deep_link_sub2: referrer_address (Starknet address of the referrer)
        
        let deepLinkValue = deepLinkObj.deeplinkValue ?? ""
        let isDeferred = deepLinkObj.isDeferred
        
        NSLog("[AppsFlyer] Deep link value: \(deepLinkValue)")
        NSLog("[AppsFlyer] Is deferred: \(isDeferred)")
        
        // Check if this is a referral link
        if deepLinkValue == "referral" || deepLinkValue == "ref" {
            var referralData: [String: Any] = [
                "type": "referral",
                "isDeferred": isDeferred,
                "deepLinkValue": deepLinkValue
            ]
            
            // Extract referral code (deep_link_sub1)
            if let referralCode = deepLinkObj.clickEvent["deep_link_sub1"] as? String {
                referralData["referralCode"] = referralCode
                NSLog("[AppsFlyer] Referral code: \(referralCode)")
            }
            
            // Extract referrer address (deep_link_sub2)
            if let referrerAddress = deepLinkObj.clickEvent["deep_link_sub2"] as? String {
                referralData["referrerAddress"] = referrerAddress
                NSLog("[AppsFlyer] Referrer address: \(referrerAddress)")
            }
            
            // Extract media source if available (only for direct deep links, not deferred)
            if !isDeferred, let mediaSource = deepLinkObj.clickEvent["media_source"] as? String {
                referralData["mediaSource"] = mediaSource
            }
            
            // Extract campaign if available
            if let campaign = deepLinkObj.clickEvent["campaign"] as? String {
                referralData["campaign"] = campaign
            }
            
            // Convert to JSON and send to JavaScript
            if let jsonData = try? JSONSerialization.data(withJSONObject: referralData),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                NotificationCenter.default.post(
                    name: NSNotification.Name("AppsFlyerDeepLink"),
                    object: nil,
                    userInfo: ["data": jsonString, "type": "referral"]
                )
                NSLog("[AppsFlyer] Referral data sent to JavaScript")
            }
        } else {
            // Handle other deep link types if needed
            NSLog("[AppsFlyer] Deep link value '\(deepLinkValue)' is not a referral link")
            
            // Still send the data to JavaScript for potential other use cases
            var deepLinkData: [String: Any] = [
                "type": "deep_link",
                "deepLinkValue": deepLinkValue,
                "isDeferred": isDeferred
            ]
            
            // Include all click event data
            for (key, value) in deepLinkObj.clickEvent {
                if let keyStr = key as? String {
                    deepLinkData[keyStr] = value
                }
            }
            
            if let jsonData = try? JSONSerialization.data(withJSONObject: deepLinkData),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                NotificationCenter.default.post(
                    name: NSNotification.Name("AppsFlyerDeepLink"),
                    object: nil,
                    userInfo: ["data": jsonString, "type": "deep_link"]
                )
            }
        }
    }
}
