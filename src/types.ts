export interface MeshModel {
  id: string;
  name: string;
  prompt: string;
  sourceImageUrl: string;
  status: 'idle' | 'generating' | 'completed' | 'failed';
  progress: number;
  verticesCount: number;
  facesCount: number;
  createdAt: string;
  // Renderer state settings
  autoRotate: boolean;
  rotationSpeed: number;
  viewMode: 'solid' | 'wireframe' | 'pointcloud';
  colorTheme: string; // Hex color or 'texture'
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  provider: 'metamask' | 'coinbase' | 'walletconnect' | null;
}

export interface StripeSessionResult {
  id: string;
  url: string | null;
  isMock: boolean;
}

export interface PurchaseHistoryItem {
  id: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: string;
  description: string;
}
