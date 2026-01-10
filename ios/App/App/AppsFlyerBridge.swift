import Foundation
import Capacitor
import AppsFlyerLib
import UIKit

/// AppsFlyer Bridge Plugin for Capacitor
/// Provides communication between Swift and JavaScript for AppsFlyer SDK
@objc(AppsFlyerBridge)
public class AppsFlyerBridge: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "AppsFlyerBridge"
    public let jsName = "AppsFlyerBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setCustomerUserId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "logEvent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAppsFlyerUID", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getDeviceId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "generateInviteUrl", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "logInvite", returnType: CAPPluginReturnPromise),
    ]

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
    /// This creates a OneLink with proper attribution parameters
    @objc func generateInviteUrl(_ call: CAPPluginCall) {
        let referralCode = call.getString("referralCode") ?? ""
        let referrerAddress = call.getString("referrerAddress") ?? ""
        let channel = call.getString("channel") ?? "mobile_share"
        let campaign = call.getString("campaign") ?? "referral"

        NSLog("[AppsFlyerBridge] Generating invite URL - code: %@, address: %@", referralCode, referrerAddress)

        AppsFlyerShareInviteHelper.generateInviteUrl(
            linkGenerator: { generator in
                // Set deep link value for identifying referral links
                generator.addParameterValue("referral", forKey: "deep_link_value")

                // Set referral code (username) in sub1
                generator.addParameterValue(referralCode, forKey: "deep_link_sub1")

                // Set referrer address in sub2
                generator.addParameterValue(referrerAddress, forKey: "deep_link_sub2")

                // Set attribution parameters
                generator.setCampaign(campaign)
                generator.setChannel(channel)

                // Add media source for tracking
                generator.addParameterValue("user_invite", forKey: "media_source")

                // Add referrer ID for rewards attribution
                generator.addParameterValue(referrerAddress, forKey: "af_sub1")

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
    /// This helps track sharing behavior and attribution
    @objc func logInvite(_ call: CAPPluginCall) {
        let channel = call.getString("channel") ?? "mobile_share"
        let referralCode = call.getString("referralCode") ?? ""
        let referrerAddress = call.getString("referrerAddress") ?? ""

        NSLog("[AppsFlyerBridge] Logging invite - channel: %@, code: %@", channel, referralCode)

        // Log the invite event with parameters
        AppsFlyerShareInviteHelper.logInvite(channel, parameters: [
            "campaign": "referral",
            "referral_code": referralCode,
            "referrer_address": referrerAddress
        ])

        NSLog("[AppsFlyerBridge] Invite logged successfully")
        call.resolve()
    }
}
