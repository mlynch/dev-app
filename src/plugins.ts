import { WebPlugin } from '@capacitor/core';

import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

export class CapacitorViewWeb extends WebPlugin {
  constructor() {
    super({
      name: 'CapacitorView',
      platforms: ['web']
    });
  }

  async open(options: { hostname: string, port: number, path: string }) {
    const url = `http://${options.hostname}:${options.port}${options.path || ''}`;
    Browser.open({
      url
    });
  }

  async close() {
  }
}
export const CapacitorView = new CapacitorViewWeb();

export class UDPDiscoveryWeb extends WebPlugin {
  constructor() {
    super({
      name: 'UDPDiscovery',
      platforms: ['web']
    });
  }

  async start() {
  }

  async stop() {
  }

  async getServices() {
    return {
      services: [
        {
          "id": "max-ionic",
          "name": "Max Ionic",
          "hostname": "localhost",
          "address": "localhost",
          "port": "3333",
          "path": "" 
        }
      ]
    };
  }
}

export const UDPDiscovery = new UDPDiscoveryWeb();