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
        let handledByFB = ApplicationDelegate.shared.application(app, open: url, options: options)
        let handledByCap = ApplicationDelegateProxy.shared.application(app, open: url, options: options)
        // Note: Deep linking with AppsFlyer will be handled via UDL (Unified Deep Linking)
        // For now, we follow the basic integration from official docs
        return handledByFB || handledByCap
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}

extension AppDelegate: AppsFlyerLibDelegate {

    func onConversionDataSuccess(_ installData: [AnyHashable: Any]) {
        if let status = installData["af_status"] as? String {
            if (status == "Non-organic") {
                // Business logic for Non-organic install scenario is invoked
                if let sourceID = installData["media_source"],
                let campaign = installData["campaign"] {
                    print("This is a Non-organic install. Media source: \(sourceID)  Campaign: \(campaign)")
                }
            }
            else {
                // Business logic for organic install scenario is invoked
            }
        }
    }

    func onConversionDataFail(_ error: Error) {
        print(error)
    }
}


extension AppDelegate: DeepLinkDelegate {
     
    func didResolveDeepLink(_ result: DeepLinkResult) {
        var fruitNameStr: String?
        switch result.status {
        case .notFound:
            NSLog("[AFSDK] Deep link not found")
            return
        case .failure:
            print("Error %@", result.error!)
            return
        case .found:
            NSLog("[AFSDK] Deep link found")
        }
        
        guard let deepLinkObj:DeepLink = result.deepLink else {
            NSLog("[AFSDK] Could not extract deep link object")
            return
        }
        
        if deepLinkObj.clickEvent.keys.contains("deep_link_sub2") {
            let ReferrerId:String = deepLinkObj.clickEvent["deep_link_sub2"] as! String
            NSLog("[AFSDK] AppsFlyer: Referrer ID: \(ReferrerId)")
        } else {
            NSLog("[AFSDK] Could not extract referrerId")
        }
        
        let deepLinkStr:String = deepLinkObj.toString()
        NSLog("[AFSDK] DeepLink data is: \(deepLinkStr)")
            
        if( deepLinkObj.isDeferred == true) {
            NSLog("[AFSDK] This is a deferred deep link")
        }
        else {
            NSLog("[AFSDK] This is a direct deep link")
        }
        
        fruitNameStr = deepLinkObj.deeplinkValue
        
        //If deep_link_value doesn't exist
        if fruitNameStr == nil || fruitNameStr == "" {
            //check if fruit_name exists
            switch deepLinkObj.clickEvent["fruit_name"] {
                case let s as String:
                    fruitNameStr = s
                default:
                    print("[AFSDK] Could not extract deep_link_value or fruit_name from deep link object with unified deep linking")
                    return
            }
        }
    }
}
