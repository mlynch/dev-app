import Foundation
import Capacitor

@objc(UDPDiscovery)
public class UDPDiscovery : CAPPlugin {
  
  var service: UDPDiscoveryService!
  var callbackID: String?
  
  public override func load() {
    service = UDPDiscoveryService(namespace: "devapp")
  }
  
  @objc func start(_ call: CAPPluginCall) {
    service.close()
    service.start { }
  }
  
  @objc func stop(_ call: CAPPluginCall) {
    service.close()
    call.resolve()
  }
  
  @objc func getServices(_ call: CAPPluginCall) {
    let message = generateMessage(service.getServices())
    call.resolve(message)
  }
  
  private func generateMessage(_ services: [Service]) -> [String: Any] {
    let arrayOfServices = services.map { (s) -> [String: Any] in
      return s.toDictionary()
    }
    return ["services": arrayOfServices]
  }
}
  
