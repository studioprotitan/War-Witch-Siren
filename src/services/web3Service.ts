import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { MeshModel } from '../types';

// Live Base Sepolia contract address
export const CONTRACT_ADDRESS = '0x8be07421a4022a1008e0c331ddd24a0c451cfd1a' as const;

/**
 * Checks if the system is running in prototype simulator mode.
 * Defaults to true for local testing and zero-wallet sandboxes.
 */
export const isPrototypeMode = (): boolean => {
  const envVal = (import.meta as any).env?.VITE_PROTOTYPE_MODE;
  if (envVal !== undefined) {
    return envVal === 'true';
  }
  return true; // Default safety fallback
};

// ABI for standardized ERC-1155 multi-token contracts
export const ERC1155_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' }
    ],
    outputs: []
  },
  {
    name: 'mintToDeploy',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  }
] as const;

export interface MintResult {
  success: boolean;
  txHash: string | null;
  tokenId: string;
  isMock: boolean;
  message: string;
}

/**
 * Handles mint-to-deploy (MTD) contract calls on Base Sepolia.
 * Gates real contract transactions behind a PROTOTYPE_MODE check.
 */
export async function exportForgeMtd(
  model: MeshModel,
  userAddress?: string | null
): Promise<MintResult> {
  const isProto = isPrototypeMode();

  // Generated fallback token identification numbers
  const mockTokenId = String(Math.floor(Math.random() * 8920) + 1040);

  if (isProto) {
    console.warn('[Web3Service] Gated via PROTOTYPE_MODE. Generating high-fidelity mock mint logs...');
    
    // Simulate real ledger time-lag
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Create realistic Tx Hash signature
    const hashHex = '0123456789abcdef';
    let mockTx = '0x';
    for (let i = 0; i < 64; i++) {
      mockTx += hashHex[Math.floor(Math.random() * 16)];
    }

    return {
      success: true,
      txHash: mockTx,
      tokenId: mockTokenId,
      isMock: true,
      message: 'ERC-1155 Mock prototype mint successfully processed!'
    };
  }

  if (!userAddress) {
    throw new Error('Wallet connection required for real Web3 contract mints.');
  }

  // Ensure window.ethereum is initialized by a browser extension
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No injected Web3 provider (e.g. MetaMask) detected in current browser context.');
  }

  try {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });

    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom((window as any).ethereum)
    });

    // Request active system address
    const [address] = await walletClient.getAddresses();
    if (!address) {
      throw new Error('Authorized Web3 account address is unavailable.');
    }

    // Prepare mint args
    const tokenIdArg = BigInt(Math.floor(Math.random() * 950000) + 5000);
    const amountArg = 1n;
    const dataArg = '0x' as `0x${string}`;

    console.log(`[Web3Service] Simulating mint on Base Sepolia contract: ${CONTRACT_ADDRESS}`);

    // Call live contract with standard 'mint' function
    const { request } = await publicClient.simulateContract({
      account: address,
      address: CONTRACT_ADDRESS,
      abi: ERC1155_ABI,
      functionName: 'mint',
      args: [address, tokenIdArg, amountArg, dataArg]
    });

    console.log('[Web3Service] Signature requested from browser wallet...');
    const hash = await walletClient.writeContract(request);

    console.log(`[Web3Service] Broadcast success! Hash: ${hash}. Waiting for confirmation...`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return {
      success: receipt.status === 'success',
      txHash: hash,
      tokenId: tokenIdArg.toString(),
      isMock: false,
      message: 'Real-time transaction confirmed by Base Sepolia validators.'
    };
  } catch (error: any) {
    console.error('[Web3Service] Contract mint execution failed:', error);
    throw new Error(error.message || 'Web3 transaction was rejected or encountered an RPC error.');
  }
}

/**
 * Specifically requested mintOracleToken function using viem/wagmi standards.
 * Connects directly to the live Base Sepolia ERC-1155 contract.
 * Checks for the VITE_PROTOTYPE_MODE / PROTOTYPE_MODE toggle flag.
 */
export async function mintOracleToken(
  userAddress: string,
  tokenId: string | number,
  amount: number = 1
): Promise<MintResult> {
  const isProto = isPrototypeMode();

  if (isProto) {
    console.info('[Web3Service] mintOracleToken executed in PROTOTYPE_MODE.');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const hashHex = '0123456789abcdef';
    let mockTx = '0x';
    for (let i = 0; i < 64; i++) {
      mockTx += hashHex[Math.floor(Math.random() * 16)];
    }

    return {
      success: true,
      txHash: mockTx,
      tokenId: String(tokenId),
      isMock: true,
      message: 'Base Sepolia Simulation: Completed ERC-1155 mint success log.'
    };
  }

  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('EVM Wallet provider not found in window context.');
  }

  try {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });

    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom((window as any).ethereum)
    });

    const [address] = await walletClient.getAddresses();
    const finalAddress = address || (userAddress as `0x${string}`);

    const numericTokenId = BigInt(tokenId);
    const numericAmount = BigInt(amount);
    const mockBytesData = '0x' as `0x${string}`;

    // Standard ERC-1155 mint(address, id, amount, data) call simulation
    const { request } = await publicClient.simulateContract({
      account: finalAddress,
      address: CONTRACT_ADDRESS,
      abi: ERC1155_ABI,
      functionName: 'mint',
      args: [finalAddress, numericTokenId, numericAmount, mockBytesData]
    });

    const txHash = await walletClient.writeContract(request);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    return {
      success: receipt.status === 'success',
      txHash,
      tokenId: tokenId.toString(),
      isMock: false,
      message: `Successfully minted ${amount} token(s) of ID #${tokenId} onto the blockchain!`
    };
  } catch (err: any) {
    console.error('[Web3Service] error in mintOracleToken:', err);
    throw new Error(err.message || 'Signature rejected or Base Sepolia network connection failed.');
  }
}

