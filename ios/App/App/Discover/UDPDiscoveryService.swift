import Foundation

public struct Service {
  
  let id: String
  let lastTimeStamp: TimeInterval
  let name: String
  let hostname: String
  let address: String
  let port: Int
  let path: String
  
  public static func ==(lhs: Service, rhs: Service) -> Bool {
    return lhs.id == rhs.id && lhs.lastTimeStamp == rhs.lastTimeStamp;
  }
  
  public func toDictionary() -> [String: Any] {
    return [
      "id": id,
      "name": name,
      "hostname": hostname,
      "address": address,
      "port": port,
      "path": path
    ]
  }
}

public class UDPDiscoveryService : NSObject, GCDAsyncUdpSocketDelegate {
  
  private static let PORT: UInt16 = 41234
  private static let PREFIX = "ION_DP"
  
  var namespace: String
  var socket: GCDAsyncUdpSocket?
  var services = [String: Service]()
  var didChange: (() -> Void)?
  
  init(namespace: String) {
    self.namespace = namespace
  }
  
  public func isRunning() -> Bool {
    return self.socket != nil
  }
  
  public func start(didChange: @escaping (()->Void)) {
    if self.isRunning() {
      return
    }
    
    let socket = GCDAsyncUdpSocket(delegate: self, delegateQueue: DispatchQueue.main)
    
    // -- Enable IP4 only
    socket.setIPv6Enabled(false)
    socket.setIPv4Enabled(true)
    
    do {
      // it seems like there is a race sometimes where close()
      // doesn't "unbind" a previous socket fast enough and socket.bind()
      // throws "Address already in use", unless we sleep() or enableReusePort()
      try socket.enableReusePort(true)
      try socket.bind(toPort: UDPDiscoveryService.PORT)
      try socket.enableBroadcast(true)
      try socket.beginReceiving()
      self.socket = socket
      self.didChange = didChange
      
    } catch _ as NSError {
      print("Issue with setting up listener")
      socket.close()
    }
  }
  
  public func getServices() -> [Service] {
    self.gc();
    return Array(self.services.values)
  }
  
  func gc() {
    let expired = Date().timeIntervalSince1970 - 8
    for (id, service) in self.services {
      if service.lastTimeStamp < expired {
        self.services.removeValue(forKey: id)
      }
    }
    self.emit();
  }
  
  private func emit() {
    self.didChange?()
  }
  
  public func udpSocket(_ sock: GCDAsyncUdpSocket, didReceive data: Data, fromAddress address: Data, withFilterContext filterContext: Any?) {
    let prefix = String(bytes: data.subdata(in: 0..<UDPDiscoveryService.PREFIX.lengthOfBytes(using: String.Encoding.ascii)), encoding: String.Encoding.ascii);
    guard prefix == UDPDiscoveryService.PREFIX else {
      return
    }
    
    let content = data.subdata(in: 6..<data.count)
    
    guard
      let json = try? JSONSerialization.jsonObject(with: content, options: []),
      let dict = json as? [String:Any],
      let namespace = dict["nspace"] as? String,
      namespace == self.namespace,
      let id = dict["id"] as? String,
      let name = dict["name"] as? String,
      let hostname = dict["host"] as? String,
      let address = dict["ip"] as? String,
      let port = dict["port"] as? Int,
      let path = dict["path"] as? String
      else { return }
    
    let now = Date().timeIntervalSince1970
    self.services[id] = Service(
      id: id,
      lastTimeStamp: now,
      name: name,
      hostname: hostname,
      address: address,
      port: port,
      path: path
    );
    self.gc();
  }
  
  public func close() {
    if !self.isRunning() {
      return
    }
    socket!.close()
    services.removeAll()
    didChange = nil
    socket = nil
  }
}
