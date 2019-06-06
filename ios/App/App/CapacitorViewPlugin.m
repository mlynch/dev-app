
//
//  CapacitorView.m
//  App
//
//  Created by Max Lynch on 6/5/19.
//

#import <Foundation/Foundation.h>

#import <Capacitor/Capacitor.h>

CAP_PLUGIN(CapacitorView, "CapacitorView",
           CAP_PLUGIN_METHOD(open, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(close, CAPPluginReturnPromise);
           )
