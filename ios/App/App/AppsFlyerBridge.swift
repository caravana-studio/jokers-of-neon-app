import Foundation
import Capacitor
import AppsFlyerLib
import UIKit

/// AppsFlyer Bridge Plugin for Capacitor
/// Provides communication between Swift and JavaScript for AppsFlyer SDK
@objc(AppsFlyerBridge)
@objcMembers
public class AppsFlyerBridge: CAPPlugin {

    // Plugin identifier for Capacitor
    @objc override public func getId() -> String {
        return "AppsFlyerBridge"
    }

    // MARK: - Lifecycle

    override public func load() {
        // Listen for conversion data from AppDelegate
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleConversionData(_:)),
            name: NSNotification.Name("AppsFlyerConversionData"),
            object: nil
        )

        // Listen for deep link data from AppDelegate
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleDeepLink(_:)),
            name: NSNotification.Name("AppsFlyerDeepLink"),
            object: nil
        )

        NSLog("[AppsFlyerBridge] Plugin loaded and listeners registered")
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    // MARK: - Notification Handlers

    @objc private func handleConversionData(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let data = userInfo["data"] as? String else {
            NSLog("[AppsFlyerBridge] Invalid conversion data notification")
            return
        }

        NSLog("[AppsFlyerBridge] Sending conversion data to JavaScript")
        notifyListeners("conversionData", data: ["data": data])
    }

    @objc private func handleDeepLink(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let data = userInfo["data"] as? String else {
            NSLog("[AppsFlyerBridge] Invalid deep link notification")
            return
        }

        NSLog("[AppsFlyerBridge] Sending deep link to JavaScript")
        notifyListeners("deepLink", data: ["data": data])
    }

    // MARK: - Plugin Methods

    /// Set Customer User ID for attribution
    @objc func setCustomerUserId(_ call: CAPPluginCall) {
        guard let customerUserId = call.getString("customerUserId") else {
            call.reject("customerUserId is required")
            return
        }

        AppsFlyerLib.shared().customerUserID = customerUserId
        NSLog("[AppsFlyerBridge] Customer User ID set: %@", customerUserId)
        call.resolve()
    }

    /// Log a custom event to AppsFlyer
    @objc func logEvent(_ call: CAPPluginCall) {
        guard let eventName = call.getString("eventName") else {
            call.reject("eventName is required")
            return
        }

        let eventValues = call.getObject("eventValues") ?? [:]
        AppsFlyerLib.shared().logEvent(eventName, withValues: eventValues)
        NSLog("[AppsFlyerBridge] Event logged: %@", eventName)
        call.resolve()
    }

    /// Get AppsFlyer unique device ID
    @objc func getAppsFlyerUID(_ call: CAPPluginCall) {
        let uid = AppsFlyerLib.shared().getAppsFlyerUID()
        NSLog("[AppsFlyerBridge] AppsFlyer UID: %@", uid)
        call.resolve(["uid": uid])
    }

    /// Get device identifier (IDFV on iOS)
    @objc func getDeviceId(_ call: CAPPluginCall) {
        let deviceId = UIDevice.current.identifierForVendor?.uuidString ?? ""
        NSLog("[AppsFlyerBridge] Device ID (IDFV): %@", deviceId)
        call.resolve(["deviceId": deviceId])
    }

    // MARK: - User Invite Methods

    /// Generate a referral invite URL using AppsFlyer SDK
    /// Creates a simple OneLink with just the referral code (username)
    @objc func generateInviteUrl(_ call: CAPPluginCall) {
        let referralCode = call.getString("referralCode") ?? ""

        NSLog("[AppsFlyerBridge] Generating invite URL - code: %@", referralCode)

        AppsFlyerShareInviteHelper.generateInviteUrl(
            linkGenerator: { generator in
                // Only set the ref parameter with the username
                // Other params (deep_link_value, pid, c) are defaults in the OneLink template
                generator.addParameterValue(referralCode, forKey: "ref")
                return generator
            },
            completionHandler: { [weak self] url in
                if let url = url {
                    NSLog("[AppsFlyerBridge] Invite URL generated: %@", url.absoluteString)
                    call.resolve(["url": url.absoluteString])
                } else {
                    NSLog("[AppsFlyerBridge] Failed to generate invite URL")
                    call.reject("Failed to generate invite URL")
                }
            }
        )
    }

    /// Log an invite event when user shares their referral link
    @objc func logInvite(_ call: CAPPluginCall) {
        let channel = call.getString("channel") ?? "mobile_share"
        let referralCode = call.getString("referralCode") ?? ""

        NSLog("[AppsFlyerBridge] Logging invite - channel: %@, code: %@", channel, referralCode)

        AppsFlyerShareInviteHelper.logInvite(channel, parameters: [
            "referral_code": referralCode
        ])

        NSLog("[AppsFlyerBridge] Invite logged successfully")
        call.resolve()
    }
}
