import React, { useState } from 'react';
import { X, CreditCard, Lock, Sparkles, Check, HelpCircle, History, Receipt, ShieldCheck } from 'lucide-react';
import { PurchaseHistoryItem } from '../types';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedTier: string | null;
  history: PurchaseHistoryItem[];
  onTriggerCheckout: (tierName: string, priceCents: number) => Promise<void>;
  isProcessing: boolean;
}

export default function StripeCheckoutModal({
  isOpen,
  onClose,
  unlockedTier,
  history,
  onTriggerCheckout,
  isProcessing
}: CreditModalProps) {
  const [activeTab, setActiveTab] = useState<'tiers' | 'history'>('tiers');

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'standard',
      name: 'Standard Node Access',
      price: '$19',
      priceCents: 1900,
      description: 'Deploy access to peripheral freight and rail repair nodes in the southern line.',
      bullets: [
        '50 Core reconstructions per cycle',
        'Standard pointcloud & mesh substrate',
        'Active at Corgemont and terminal nodes',
        'Durable mechanical-organic files (.OBJ)'
      ],
      popular: false,
      badge: 'Peripheral Node'
    },
    {
      id: 'premium',
      name: 'Styx Gateway Synapse',
      price: '$49',
      priceCents: 4900,
      description: 'High-security synchronic interface connecting the internal network to the Enigmatic Universe.',
      bullets: [
        'Unlimited premium Furnace reconstructions',
        'High-density 4K vertex unwraps & normals',
        'Bypasses Affiliate throttle codes completely',
        'Supports PBR metallic & Cenote teal textures',
        'Access to regional control & Station City plans'
      ],
      popular: true,
      badge: 'Styx Synapse Option'
    }
  ];

  return (
    <div id="stripe-checkout-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container card */}
      <div className="relative w-full max-w-2xl bg-[#0d0b08] border border-[#2e2418] rounded-2xl shadow-[0_0_50px_rgba(196,106,26,0.15)] overflow-hidden flex flex-col select-none animate-fade-in animate-slide-in">
        
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#c46a1a]" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#2e2418] flex items-center justify-between bg-[#080604]">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('tiers')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-share font-bold tracking-wider transition cursor-pointer ${activeTab === 'tiers' ? 'bg-[#c46a1a]/10 text-[#c46a1a] border border-[#c46a1a]/20' : 'text-slate-400 hover:text-white'}`}
            >
              <Sparkles className="w-4 h-4" /> UPGRADE ACCESS SYNAPSE
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-share font-bold tracking-wider transition cursor-pointer ${activeTab === 'history' ? 'bg-[#c46a1a]/10 text-[#c46a1a] border border-[#c46a1a]/20' : 'text-slate-400 hover:text-white'}`}
            >
              <History className="w-4 h-4" /> RECONSTRUCTION LOGS
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-[#1a1510] hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'tiers' ? (
            /* Pricing modules */
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-1.5">
                <h3 className="text-sm font-cinzel font-bold text-white tracking-wider uppercase">Select your Synapse Reconstruction Tier</h3>
                <p className="text-xs text-[#8b7d6b] leading-relaxed font-mono">
                  Secure cryptographic transit fully processed via Stripe. Unlock premium Furnace hardening loops.
                </p>
              </div>

              {/* Tiers listing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiers.map((tier) => {
                  const isActiveUserTier = unlockedTier === tier.id;
                  
                  return (
                    <div
                      key={tier.id}
                      className={`relative flex flex-col p-5 rounded-xl border transition-all ${tier.popular ? 'bg-[#131008] border-[#c46a1a]/30 shadow-[#c46a1a]/5' : 'bg-[#0d0b08] border-[#2e2418]'} ${isActiveUserTier ? 'ring-2 ring-[#c46a1a] border-transparent' : ''}`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2.5 right-4 text-[9px] font-share font-bold bg-[#c46a1a] text-white px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(196,106,26,0.4)]">
                          {tier.badge}
                        </span>
                      )}

                      <div className="space-y-1">
                        <h4 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider">{tier.name}</h4>
                        <p className="text-[11px] font-mono text-[#8b7d6b] min-h-[36px] leading-relaxed">{tier.description}</p>
                      </div>

                      <div className="my-4 flex items-baseline gap-1">
                        <span className="text-3xl font-share font-bold text-[#c46a1a]">{tier.price}</span>
                        <span className="text-xs font-mono text-slate-500">USD, single node pay</span>
                      </div>

                      {/* Bullet list */}
                      <ul className="space-y-2 flex-grow mb-6">
                        {tier.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-[10px] font-mono text-slate-300">
                            <Check className="w-3.5 h-3.5 text-[#c46a1a] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Trigger */}
                      <button
                        onClick={() => onTriggerCheckout(tier.id.toUpperCase(), tier.priceCents)}
                        disabled={isProcessing || isActiveUserTier}
                        className={`w-full py-2.5 rounded-lg text-xs font-share font-bold tracking-wider transition duration-200 flex items-center justify-center gap-2 cursor-pointer ${isActiveUserTier ? 'bg-[#c46a1a]/10 text-[#c46a1a] border border-[#c46a1a]/20 cursor-default' : 'bg-[#c46a1a] text-white hover:bg-[#a67c2a] disabled:opacity-50 shadow-[0_0_12px_rgba(196,106,26,0.2)]'}`}
                      >
                        {isActiveUserTier ? (
                          <>
                            <ShieldCheck className="w-4 h-4 animate-pulse" /> ACTIVE FURNACE ACCESS
                          </>
                        ) : isProcessing ? (
                          "LAUNCHING GATEWAY..."
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 text-white" /> SECURE STRIPE GATEWAY
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Developer notice about fallback modes */}
              <div className="p-4 rounded-xl border border-[#c46a1a]/20 bg-[#c46a1a]/5 flex gap-3">
                <Lock className="w-4 h-4 text-[#c46a1a] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[10px] font-share text-white uppercase font-bold tracking-wider">STRIPE MAPPING HANDSHAKE</h5>
                  <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
                    This channel is connected to preconfigured Stripe gateways. In the absence of a live network environment <code className="text-[#c46a1a] bg-[#1a1510] px-1 py-0.5 rounded">STRIPE_SECRET_KEY</code>, an automated clientside simulation handles complete test loop handshakes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Statement historical views */
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#0d0b08] px-4 py-3 rounded-lg border border-[#2e2418]">
                <div className="flex gap-2 items-center">
                  <Receipt className="w-4 h-4 text-[#c46a1a]" />
                  <span className="text-xs font-share text-slate-300 font-bold uppercase tracking-wider">HISTORIC ACCOUNT INVOICES</span>
                </div>
                <span className="text-[10px] font-share text-slate-400">TOTAL TRANSACTIONS: {history.length}</span>
              </div>

              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((h) => (
                    <div key={h.id} className="bg-[#131008] p-3.5 rounded-xl border border-[#2e2418] flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-xs font-mono font-medium text-white">{h.description}</p>
                        <p className="text-[9px] font-share text-slate-500">{new Date(h.createdAt).toLocaleDateString()} &bull; TRANS_ID: {h.id}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white">${(h.amount / 100).toFixed(2)}</span>
                        <div className="flex items-center gap-1 mt-0.5 justify-end">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c46a1a] shadow-[0_0_4px_#c46a1a]" />
                          <span className="text-[8px] font-share text-[#c46a1a] uppercase">{h.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-[#0d0b08] border border-dashed border-[#2e2418] rounded-xl">
                  <HelpCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs font-mono text-[#8b7d6b]">No logs found on this Stripe identity.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
