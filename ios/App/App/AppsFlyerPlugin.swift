import Foundation
import Capacitor
import AppsFlyerLib

/**
 * AppsFlyer Plugin for Capacitor
 * Provides bridge between JavaScript and AppsFlyer SDK
 */
@objc(AppsFlyerPlugin)
public class AppsFlyerPlugin: CAPPlugin {
    
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
    
    @objc func generateInviteLink(_ call: CAPPluginCall) {
        guard let userAddress = call.getString("userAddress") else {
            call.reject("userAddress is required")
            return
        }
        
        let linkGenerator = AppsFlyerShareInviteHelper.generateInviteUrl(
            linkGenerator: { (_ generator: AppsFlyerLinkGenerator) -> AppsFlyerLinkGenerator in
                generator.addParameterValue(userAddress, forKey: "referrer_address")
                generator.addParameterValue("referral", forKey: "campaign")
                generator.addParameterValue("user_invite", forKey: "media_source")
                return generator
            }
        )
        
        linkGenerator.addOnAppOpenAttribution { (result) in
            // Handle deep link
            if let deepLink = result?.deepLinkValue(forKey: "referrer_address") {
                call.resolve(["deepLinkValue": deepLink])
            }
        }
        
        linkGenerator.addOnConversionData { (result) in
            // Handle conversion data
            if let conversionData = result?.conversionData {
                call.resolve(["conversionData": conversionData])
            }
        }
        
        linkGenerator.setOnResponse { (response) in
            if let error = response?.error {
                call.reject("Error generating invite link: \(error.localizedDescription)")
            } else if let url = response?.link {
                call.resolve(["inviteLink": url.absoluteString])
            }
        }
        
        linkGenerator.generateLink()
    }
    
    @objc func getAppsFlyerUID(_ call: CAPPluginCall) {
        let uid = AppsFlyerLib.shared().getAppsFlyerUID()
        call.resolve(["uid": uid])
    }
}
