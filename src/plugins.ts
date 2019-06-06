import { registerWebPlugin, WebPlugin } from '@capacitor/core';

import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

export class CapacitorViewWeb extends WebPlugin {
  constructor() {
    super({
      name: 'CapacitorView',
      platforms: ['web']
    });
  }

  async open(options: { url: string }) {
    console.log('Would open preview');

    Browser.open({
      url: options.url
    });
  }

  async close(options: { url: string }) {
    console.log('Would close preview');
  }
}



export const CapacitorView = new CapacitorViewWeb();
