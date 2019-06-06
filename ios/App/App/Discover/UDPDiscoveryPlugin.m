
//
//  CapacitorView.m
//  App
//
//  Created by Max Lynch on 6/5/19.
//

#import <Foundation/Foundation.h>

#import <Capacitor/Capacitor.h>

CAP_PLUGIN(UDPDiscovery, "UDPDiscovery",
           CAP_PLUGIN_METHOD(start, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(stop, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getServices, CAPPluginReturnPromise);
           )
