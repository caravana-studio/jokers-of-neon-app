import Foundation
import Capacitor
import AppsFlyerLib

/**
 * AppsFlyer Bridge Plugin for Capacitor
 * Provides communication between Swift and JavaScript for AppsFlyer events
 */
@objc(AppsFlyerBridge)
public class AppsFlyerBridge: CAPPlugin {
    
    private static var sharedInstance: AppsFlyerBridge?
    
    override public func load() {
        AppsFlyerBridge.sharedInstance = self
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleConversionData(_:)),
            name: NSNotification.Name("AppsFlyerConversionData"),
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleDeepLink(_:)),
            name: NSNotification.Name("AppsFlyerDeepLink"),
            object: nil
        )
    }
    
    @objc private func handleConversionData(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let data = userInfo["data"] as? String else {
            return
        }
        
        // Send to JavaScript
        notifyListeners("conversionData", data: ["data": data])
    }
    
    @objc private func handleDeepLink(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let data = userInfo["data"] as? String else {
            return
        }
        
        // Send to JavaScript
        notifyListeners("deepLink", data: ["data": data])
    }
    
    @objc func setCustomerUserId(_ call: CAPPluginCall) {
        guard let customerUserId = call.getString("customerUserId") else {
            call.reject("customerUserId is required")
            return
        }
        
        AppsFlyerLib.shared().customerUserID = customerUserId
        call.resolve()
    }
    
    @objc func logEvent(_ call: CAPPluginCall) {
        guard let eventName = call.getString("eventName") else {
            call.reject("eventName is required")
            return
        }
        
        let eventValues = call.getObject("eventValues") ?? [:]
        AppsFlyerLib.shared().logEvent(eventName, withValues: eventValues)
        
        call.resolve()
    }
    
    @objc func getAppsFlyerUID(_ call: CAPPluginCall) {
        let uid = AppsFlyerLib.shared().getAppsFlyerUID()
        call.resolve(["uid": uid])
    }
}
