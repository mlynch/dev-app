import Capacitor

@objc(CapacitorView)
public class CapacitorView: CAPPlugin {
  var previewVC: PreviewViewController?
  
  @objc func open(_ call: CAPPluginCall) {
    guard let hostname = call.getString("hostname") else {
      call.reject("Must provide a hostname")
      return
    }
    let port = call.getInt("port") ?? 80
    let path = call.getString("path") ?? "/"
      
    print("Opening new Capacitor view at hostname and port", hostname, port)
    
    DispatchQueue.main.async {
      let vc = PreviewViewController()
      vc.hostname = hostname
      vc.port = port
      vc.path = path
      vc.closeHandler = {() -> Void in
        vc.dismiss(animated: true, completion: {
          call.resolve()
        })
      }
      vc.shakeHandler = {() -> Void in
        self.showDevMenu()
      }
      
      self.previewVC = vc
      
      vc.modalPresentationStyle = .fullScreen
      
      self.bridge.viewController.present(vc, animated: true) {
        print ("Closed cap view")
      }
    }
  }
  
  @objc func close(_ call: CAPPluginCall) {
    closePreview(onDismissed: {
      call.resolve()
    })
  }
  
  private func closePreview(onDismissed: @escaping (() -> Void)) {
    guard let vc = self.previewVC else {
      print("No active Capacitor View to close")
      return
    }
    
    DispatchQueue.main.async {
      vc.dismiss(animated: true, completion: {
        onDismissed();
      })
    }
  }
  
  private func showDevMenu() {
    guard let vc = previewVC else {
      return
    }
    
    let alert = UIAlertController(title: "Dev Menu", message: nil, preferredStyle: .actionSheet)
    
    alert.addAction(UIAlertAction(title: "Reload", style: .default , handler:{ (UIAlertAction)in
      vc.reload()
    }))
    
    alert.addAction(UIAlertAction(title: "Exit Preview", style: .destructive, handler:{ (UIAlertAction)in
      self.closePreview {
        
      }
    }))
    
    alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler:{ (UIAlertAction)in
      alert.dismiss(animated: true, completion: {
        
      })
    }))
    
    vc.present(alert, animated: true, completion: {
      
    })
  }
}

class PreviewViewController : UIViewController, UIGestureRecognizerDelegate {
  public var capVC: CAPBridgeViewController?
  public var hostname: String?
  public var port: Int = 80
  public var path: String = "/"
  public var closeHandler: (() -> Void)?
  public var shakeHandler: (() -> Void)?

  public func reload() {
    capVC?.bridge?.reload()
  }
  
  public override func viewDidLoad() {
    guard let hostname = self.hostname else {
      print("Missing hostname")
      return
    }
    
    self.view.isUserInteractionEnabled = true
    self.view.bounds = UIScreen.main.bounds
    
    let gesture = UISwipeGestureRecognizer(target: self, action: #selector(self.handleThreeFingerSwipe))
    gesture.delegate = self
    gesture.direction = .down
    gesture.delaysTouchesBegan = true
    gesture.numberOfTouchesRequired = 2
    
    self.view.addGestureRecognizer(gesture)
    
    capVC = CAPBridgeViewController()
    
    let url = "http://\(hostname):\(port)\(path)"
    let configText = """
    {
      "server": {
        "url": "\(url)",
        "allowNavigation": ["\(hostname)"]
      }
    }
    """
    
    capVC!.config = configText
    capVC!.view.frame = UIScreen.main.bounds
    self.view.addSubview(capVC!.view!)
  }
  
  @objc func handleThreeFingerSwipe() {
    if self.closeHandler != nil {
      self.closeHandler!()
    }
  }
  
  public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
    return true
  }
  
  public override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
    if event?.type == .motion && event?.subtype == .motionShake {
      if self.shakeHandler != nil {
        self.shakeHandler!()
      }
    }
  }
}
