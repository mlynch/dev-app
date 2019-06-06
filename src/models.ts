export interface AppConnectOptions {
  url: string;
}

export interface DiscoveredService {
  id: string;
  name: string;
  hostname: string;
  address: string;
  port: string;
  path: string;
}