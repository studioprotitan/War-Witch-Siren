import React, { useState } from 'react';
import { X, Wallet, Shield, Check, Copy, ExternalLink, RefreshCw, QrCode } from 'lucide-react';
import { WalletState } from '../types';

interface WalletPanelProps {
  wallet: WalletState;
  onConnect: (provider: 'metamask' | 'coinbase' | 'walletconnect') => void;
  onDisconnect: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletConnectPanel({
  wallet,
  onConnect,
  onDisconnect,
  isOpen,
  onClose
}: WalletPanelProps) {
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleProviderSelect = (provider: 'metamask' | 'coinbase' | 'walletconnect') => {
    setConnectingProvider(provider);
    
    if (provider === 'walletconnect') {
      setQrCodeOpen(true);
      // Simulate connection scan delay
      setTimeout(() => {
        onConnect(provider);
        setConnectingProvider(null);
        setQrCodeOpen(false);
      }, 5000);
    } else {
      // Simulate extensions handshake
      setTimeout(() => {
        onConnect(provider);
        setConnectingProvider(null);
      }, 1500);
    }
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="wallet-connect-slideover" className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-xs flex justify-end">
      {/* Background overlay click closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#0d0b08] border-l border-[#2e2418] shadow-[0_0_50px_rgba(0,0,0,0.9)] h-full flex flex-col z-10 select-none animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2e2418] bg-[#080604]">
          <div className="flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-[#c46a1a] drop-shadow-[0_0_8px_rgba(196,106,26,0.4)]" />
            <h3 className="text-sm font-share font-bold tracking-wider text-white">FORGE NODE CONNECTION</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-[#1a1510] hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {wallet.isConnected && wallet.address ? (
            /* Connected state module */
            <div className="space-y-6">
              <div className="bg-[#131008] rounded-xl border border-[#c46a1a]/30 p-5 space-y-4 shadow-[0_0_15px_rgba(196,106,26,0.05)]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-share bg-[#c46a1a]/10 text-[#c46a1a] border border-[#c46a1a]/20 px-2 py-0.5 rounded uppercase tracking-wider">
                      {wallet.provider?.toUpperCase()} COGNITIVE INTERFACE SYNCED
                    </span>
                    <h2 className="text-2xl font-share font-bold text-white mt-2">
                      {wallet.balance} <span className="text-sm text-[#8b7d6b]">LEY</span>
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#c46a1a]/10 border border-[#c46a1a]/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#c46a1a] animate-pulse" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2e2418] flex items-center justify-between text-xs">
                  <div className="font-mono text-slate-400 bg-[#0d0b08] px-3 py-1.5 rounded-lg border border-[#2e2418] truncate max-w-[200px]">
                    {wallet.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyAddress}
                      className="p-2 rounded-lg bg-[#0d0b08] hover:bg-[#1a1510] border border-[#2e2418] text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#c46a1a]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://etherscan.io/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#0d0b08] hover:bg-[#1a1510] border border-[#2e2418] text-slate-400 hover:text-white transition"
                      title="View Etherscan"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Connected details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-share text-[#8b7d6b] tracking-wider font-semibold">SIGNAL ANALYSIS OVERVIEW</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#131008]/60 p-3 rounded-xl border border-[#2e2418]">
                    <span className="text-[9px] font-mono text-[#8b7d6b]">Active Junction</span>
                    <p className="text-xs font-share text-white mt-1">Southern Rail Line</p>
                  </div>
                  <div className="bg-[#131008]/60 p-3 rounded-xl border border-[#2e2418]">
                    <span className="text-[9px] font-mono text-[#8b7d6b]">Ley Line Latency</span>
                    <p className="text-xs font-share text-[#c46a1a] mt-1">12 mHz (-3% drift)</p>
                  </div>
                </div>
              </div>

              {/* Disconnect trigger */}
              <div className="pt-4">
                <button
                  onClick={onDisconnect}
                  className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 text-xs font-share tracking-wider font-bold transition cursor-pointer"
                >
                  DISCONNECT ACCESS NODE
                </button>
              </div>
            </div>
          ) : (
            /* Choose connection options */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xs text-[#8b7d6b] font-mono leading-relaxed">
                  Connect credentials to authorize safe retrieval of forming Cores. Establishing this handshake identifies your Siren class signature.
                </p>
              </div>

              {/* Wallet lists */}
              <div className="space-y-3">
                {/* MetaMask */}
                <button
                  onClick={() => handleProviderSelect('metamask')}
                  disabled={!!connectingProvider}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#2e2418] bg-[#131008] hover:bg-[#1a1510] hover:border-[#c46a1a]/40 transition group disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f6851b]/10 flex items-center justify-center border border-[#f6851b]/20">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" referrerPolicy="no-referrer" alt="MetaMask" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-share font-bold text-white group-hover:text-[#c46a1a] transition">MetaMask Key</h4>
                      <p className="text-[9px] font-mono text-slate-500">Connect extension handshake</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 bg-[#0d0b08] border border-[#2e2418] px-2 py-1 rounded">
                    {connectingProvider === 'metamask' ? (
                      <RefreshCw className="w-3.5 h-3.5 text-[#c46a1a] animate-spin" />
                    ) : (
                      "Forge Checked"
                    )}
                  </div>
                </button>

                {/* Coinbase Wallet */}
                <button
                  onClick={() => handleProviderSelect('coinbase')}
                  disabled={!!connectingProvider}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#2e2418] bg-[#131008] hover:bg-[#1a1510] hover:border-[#c46a1a]/40 transition group disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0052ff]/10 flex items-center justify-center border border-[#0052ff]/20">
                      <img src="https://seeklogo.com/images/C/coinbase-wallet-logo-C727CD5754-seeklogo.com.png" referrerPolicy="no-referrer" alt="Coinbase Wallet" className="w-5 h-5 object-contain rounded" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-share font-bold text-white group-hover:text-[#c46a1a] transition">Coinbase Wallet</h4>
                      <p className="text-[9px] font-mono text-slate-500">Secure Coinbase gateway</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-[#0d0b08] border border-[#2e2418] px-2 py-1 rounded">
                    {connectingProvider === 'coinbase' ? (
                      <RefreshCw className="w-3.5 h-3.5 text-[#c46a1a] animate-spin" />
                    ) : (
                      "Coinbase Link"
                    )}
                  </div>
                </button>

                {/* WalletConnect QR */}
                <button
                  onClick={() => handleProviderSelect('walletconnect')}
                  disabled={!!connectingProvider}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#2e2418] bg-[#131008] hover:bg-[#1a1510] hover:border-[#c46a1a]/40 transition group disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c46a1a]/10 flex items-center justify-center border border-[#c46a1a]/20">
                      <img src="https://images.seeklogo.com/logo-png/43/1/walletconnect-logo-png_seeklogo-431872.png" referrerPolicy="no-referrer" alt="WalletConnect" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-share font-bold text-white group-hover:text-[#c46a1a] transition">WalletConnect</h4>
                      <p className="text-[9px] font-mono text-slate-500">Link multi-chain mobile wallets</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-share text-[#c46a1a] bg-[#0d0b08] border border-[#2e2418] px-2 py-1 rounded flex items-center gap-1">
                    {connectingProvider === 'walletconnect' ? (
                      <RefreshCw className="w-3.5 h-3.5 text-[#c46a1a] animate-spin" />
                    ) : (
                      <>
                        <QrCode className="w-3.5 h-3.5 text-[#c46a1a]" />
                        <span>Sign Link</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Interactive WalletConnect scanning module */}
              {qrCodeOpen && (
                <div className="bg-[#080604] border border-[#2e2418] rounded-2xl p-5 text-center space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-[#2e2418]">
                    <span className="text-[10px] font-share text-slate-400 font-bold uppercase">SIGN SYNAPSE HANDSHAKE</span>
                    <button onClick={() => setQrCodeOpen(false)} className="text-slate-500 hover:text-white cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 bg-white rounded-xl max-w-[170px] mx-auto shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    {/* Simulated elegant QR code representation */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=wc:97dddbde-ebb5-4dfb-af25-23f2412335c3@2?bridge=https://bridge.walletconnect.org`}
                      referrerPolicy="no-referrer"
                      alt="WalletConnect QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-mono text-white animate-pulse">Scan with your mobile authentication module</p>
                    <p className="text-[10px] font-share text-[#c46a1a] flex items-center justify-center gap-1.5 font-bold">
                      <RefreshCw className="w-3 h-3 animate-spin text-[#c46a1a]" /> SECURING ACCESS PROTOCOL...
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-[#080604] rounded-xl border border-[#2e2418] flex items-start gap-3">
                <Shield className="w-4 h-4 text-[#c46a1a] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[10px] font-share text-white uppercase font-bold">Secure Geothermal Tunnel</h5>
                  <p className="text-[10px] font-mono text-[#8b7d6b] leading-relaxed">
                    Access handshakes are strictly local. This connection maps credentials to the regional Southern Rail database in read-only diagnostic mode.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
