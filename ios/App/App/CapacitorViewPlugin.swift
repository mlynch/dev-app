import Capacitor

@objc(CapacitorView)
public class CapacitorView: CAPPlugin {
  var previewVC: PreviewViewController?
  
  @objc func open(_ call: CAPPluginCall) {
    guard let url = call.getString("url") else {
      call.reject("Must provide a URL")
      return
    }
    print("Opening new Capacitor view at URL", url)
    
    let vc = PreviewViewController()
    vc.url = url
    vc.closeHandler = {() -> Void in
      vc.dismiss(animated: true, completion: {
        call.resolve()
      })
    }
    vc.shakeHandler = {() -> Void in
    }
    
    previewVC = vc
    
    DispatchQueue.main.async {
      self.bridge.viewController.present(vc, animated: true) {
        print ("Closed cap view")
      }
    }
  }
  
  @objc func close(_ call: CAPPluginCall) {
    guard let vc = self.previewVC else {
      call.reject("No active Capacitor View to close")
      return
    }
    
    DispatchQueue.main.async {
      vc.dismiss(animated: true, completion: {
        call.resolve()
      })
    }
  }
}

class PreviewViewController : UIViewController, UIGestureRecognizerDelegate {
  public var capVC: CAPBridgeViewController?
  public var url: String?
  public var closeHandler: (() -> Void)?
  public var shakeHandler: (() -> Void)?
  
  public override func viewDidLoad() {
    guard let url = self.url else {
      print("Missing URL")
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
    
    capVC!.config = "{ \"server\": { \"url\": \"\(url)\" }}"
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
