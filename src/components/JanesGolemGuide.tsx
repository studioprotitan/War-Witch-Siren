import React, { useState } from 'react';
import { 
  Book, Shield, Cpu, Activity, Zap, Compass, Star, Wrench, 
  Terminal, Scroll, AlertCircle, ShoppingCart, Search, Filter, 
  Check, CreditCard, Wallet, Flame, Layers, Box, Sparkles, 
  RefreshCw, Clipboard, ExternalLink, ArrowRight, CornerDownRight, Award,
  Globe
} from 'lucide-react';

interface GolemGuideProps {
  wallet?: {
    isConnected: boolean;
    address: string | null;
    balance: string | null;
    provider: 'metamask' | 'coinbase' | 'walletconnect' | null;
  };
  onOpenWallet?: () => void;
  onConnectWallet?: (provider: 'metamask' | 'coinbase' | 'walletconnect') => void;
  onDisconnectWallet?: () => void;
  onTriggerStripeCheckout?: (packageName: string, cents: number) => Promise<any>;
  purchaseHistory?: any[];
  onAddPurchase?: (item: any) => void;
}

// Lore Cards Catalog DB
const LORE_CARDS_DATA = [
  {
    id: "lc-1",
    name: "Shade Vael — Ghostface Assassin",
    rarity: "Ultra Rare",
    faction: "CST — ERT Division",
    type: "Wraith Commander",
    costGvr: "0.024 GVR",
    priceUsd: 15.00,
    priceCents: 1500,
    abilities: ["Shadow Strike", "Phantom Drift", "Null Resonance"],
    stats: { atk: 9200, def: 7400, speed: "S-Tier", rank: "WR-01" },
    lore: "Handpicked from the Top 12 Pilots in Corgemont District. A master of silencing corrupted signal lines.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lc-2",
    name: "Auremis — The Yellow Crowned Witch",
    rarity: "Legendary",
    faction: "Corgemont Station Sovereign",
    type: "Oracle Conduit",
    costGvr: "0.068 GVR",
    priceUsd: 45.00,
    priceCents: 4500,
    abilities: ["Crown Broadcast", "Ley Stream Riding", "Frequency Lock"],
    stats: { atk: 6500, def: 8500, speed: "A-Tier", rank: "SOVEREIGN" },
    lore: "At the center of Corgemont Station, Auremis sits crowned in signal gold. Her whisper pulses active Core Stones.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lc-3",
    name: "Kazenōbu — Tengu Golem Warlord",
    rarity: "Legendary",
    faction: "Steamfitters Guild",
    type: "Sky Siege Defender",
    costGvr: "0.052 GVR",
    priceUsd: 39.00,
    priceCents: 3900,
    abilities: ["Thermal Ascent", "Storm Talons", "Iron Plumage"],
    stats: { atk: 11500, def: 10200, speed: "S-Tier", rank: "LEGEND" },
    lore: "Forged in the furnaces of the Steamfitters Armory, Kazenōbu rules the sky routes of the diesel world.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lc-4",
    name: "Nyxi Glitch — Siren Witch",
    rarity: "Rare",
    faction: "Siren Division",
    type: "Signal Disruptor",
    costGvr: "0.016 GVR",
    priceUsd: 9.00,
    priceCents: 900,
    abilities: ["Signal Shatter", "Sonic Reef", "Glitch Pulse"],
    stats: { atk: 7100, def: 5200, speed: "A-Tier", rank: "CONTAIN" },
    lore: "Nyxi carries the frequency of broken gateways. She can rewrite rail vectors mid-flight.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600"
  }
];

// MTD Deck cards list
const MTD_DECK_CARDS = [
  {
    id: "mtd-1",
    name: "Base Pilot",
    category: "Pilot Unit",
    rarity: "Common",
    priceUsd: 2.50,
    priceCents: 250,
    stats: { "Cognitive Index": "45%", "Neural Sync": "S-1", "Deploy Cost": "100 LEY" },
    description: "Standard humanoid pilot calibrated for bulk freight and scrap hauling in Corgemont sector.",
    abex: "15%",
    lore: "The frontline workers of the southern lines. Standard training logs show high endurance and low relic sensitivity.",
    icon: Compass
  },
  {
    id: "mtd-2",
    name: "Forge Stone",
    category: "Catalyst Block",
    rarity: "Uncommon",
    priceUsd: 4.00,
    priceCents: 400,
    stats: { "Resonance Factor": "1.4x", "Heat Yield": "350C", "Stability Boost": "+15%" },
    description: "Refined silicate geode capable of absorbing heat surges inside the main furnace.",
    abex: "30%",
    lore: "Excavated from basalt layers around geothermal vent nodes. Used to solidify molten Siren composites.",
    icon: Wrench
  },
  {
    id: "mtd-3",
    name: "Golem Core",
    category: "Reactor Core",
    rarity: "Rare",
    priceUsd: 12.00,
    priceCents: 1200,
    stats: { "Output Level": "8,500 kW", "Voltage Drift": "0.4%", "Alloy Match": "94%" },
    description: "High-density plasma vessel with integrated runic containment rings.",
    abex: "45%",
    lore: "Whisper-reactive electromagnetic power module. Binds directly to the robotic spine assembly.",
    icon: Cpu
  },
  {
    id: "mtd-4",
    name: "MTD Fuel Card",
    category: "Logistics",
    rarity: "Common",
    priceUsd: 1.50,
    priceCents: 150,
    stats: { "Decay Rate": "0.1GVR/h", "Max Capacity": "10 GVR", "Flow Rate": "Standard" },
    description: "Cryptographic credentials card providing fast access to standard fueling rail junctions.",
    abex: "10%",
    lore: "Distributed by the World Pilots Union to ensure automated track navigation across sectors.",
    icon: Activity
  },
  {
    id: "mtd-5",
    name: "Glitch Goblin Construct",
    category: "Rogue Unit",
    rarity: "Rare",
    priceUsd: 9.50,
    priceCents: 950,
    stats: { "Disrupt Wave": "60 dB", "Speed Velocity": "95 m/s", "Evasive Rate": "A-Grade" },
    description: "Piecemeal copper construct that crawls along track lines emitting signal decay.",
    abex: "55%",
    lore: "Built by rogue scrap fitters to mess up automated surveillance nets inside the Jane District.",
    icon: Award
  },
  {
    id: "mtd-6",
    name: "Scout Droid",
    category: "Utility Droid",
    rarity: "Uncommon",
    priceUsd: 4.50,
    priceCents: 450,
    stats: { "Scan Sweep": "400 m", "Target Lock": "3 Sec", "Optics Type": "Thermal" },
    description: "Compact floating drone carrying high-frequency telemetry radar systems.",
    abex: "25%",
    lore: "Bypasses typical EMP sandstorms to beam spatial layouts straight back to train escort squads.",
    icon: Shield
  },
  {
    id: "mtd-7",
    name: "Drones",
    category: "Swarm Unit",
    rarity: "Common",
    priceUsd: 3.00,
    priceCents: 300,
    stats: { "Swarm Count": "4 Drones", "Sync Margin": "0.1ms", "Ammo Type": "Kinetic" },
    description: "Chain-linked support hovering units providing overlapping crossfires.",
    abex: "20%",
    lore: "Runs on a localized mesh wireless loop. Highly efficient for track sweeping and point-defense.",
    icon: Cpu
  },
  {
    id: "mtd-8",
    name: "Grenades",
    category: "Munition Pack",
    rarity: "Common",
    priceUsd: 1.00,
    priceCents: 100,
    stats: { "Blast Radius": "15 m", "Thermal Yield": "1200 BTU", "Pierce Rate": "80%" },
    description: "Standard high-explosive payloads with reliable delay fuses.",
    abex: "10%",
    lore: "Kept inside the standard heavy escort vehicle cabins in case of close-combat Siren ambushes.",
    icon: Zap
  },
  {
    id: "mtd-9",
    name: "Ashborn Armaments",
    category: "Weapons Division",
    rarity: "Legendary",
    priceUsd: 25.00,
    priceCents: 2500,
    stats: { "Magma Blast": "14,000", "Heat Exposure": "92%", "Core Load": "High" },
    description: "Pre-corruption thermic cannon using compressed basalt magma fuel.",
    abex: "80%",
    lore: "Recovered from the ancient deep vents. Its shell resists high reactor heat cycles without degradation.",
    icon: Flame
  },
  {
    id: "mtd-10",
    name: "Salvage Yard",
    category: "Logistics Area",
    rarity: "Uncommon",
    priceUsd: 6.00,
    priceCents: 600,
    stats: { "Scrap Output": "40 kg/h", "Storage Rooms": "12 Blocks", "Recovery Margin": "95%" },
    description: "Demarcated sector in the Jane District optimized for scrap recovery and refinery.",
    abex: "35%",
    lore: "Operated by the Steamfitters Guild to feed raw materials into Golem Forge printers.",
    icon: Wrench
  },
  {
    id: "mtd-11",
    name: "Junkyard Golems",
    category: "Heavy Infantry",
    rarity: "Rare",
    priceUsd: 14.50,
    priceCents: 1450,
    stats: { "Shield Thickness": "80 mm", "Impact Force": "9,500 N", "Operational Time": "4h" },
    description: "Crude but heavy robot chassis pieced together from locomotive parts and armored plating.",
    abex: "50%",
    lore: "Built inside the salvage yards without standard safety runic seals. Prone to signal glitches but extremely tough.",
    icon: Compass
  },
  {
    id: "mtd-12",
    name: "Freight Car",
    category: "Logistics",
    rarity: "Uncommon",
    priceUsd: 7.00,
    priceCents: 700,
    stats: { "Max Load": "250 Tons", "Rail Coupling": "Magnetic", "Armor Class": "G-4" },
    description: "CST armored cargo chassis built to transport oversized Golems safely across high-risk lines.",
    abex: "30%",
    lore: "Comes with automated locking clamps and ambient geothermal heaters for fragile Siren components.",
    icon: Box
  },
  {
    id: "mtd-13",
    name: "MTD Survival Character",
    category: "Hero Pilot",
    rarity: "Legendary",
    priceUsd: 30.00,
    priceCents: 3000,
    stats: { "Grit Factor": "98%", "Tactical Eye": "S-Tier", "Psi Sensitivity": "95mHz" },
    description: "Wasteland-hardened commander wearing prototype bioreactive HMI helm.",
    abex: "85%",
    lore: "A veteran scout who survived the Styx Gateway breach. They have bonded directly with pre-corruption tech.",
    icon: Star
  },
  {
    id: "mtd-14",
    name: "MTD Wasteland",
    category: "Sector Map",
    rarity: "Rare",
    priceUsd: 11.50,
    priceCents: 1150,
    stats: { "Anomalies Count": "14 Sites", "Corrupted Area": "75%", "Weather Factor": "EMP Rain" },
    description: "Localized data matrix documenting safe channels through the radiation-fogged slag areas.",
    abex: "65%",
    lore: "An essential navigational blueprint for any expedition seeking ancient basalt relics.",
    icon: Compass
  },
  {
    id: "mtd-15",
    name: "Ward Card",
    category: "Bank Ward",
    rarity: "Legendary",
    priceUsd: 28.00,
    priceCents: 2800,
    stats: { "Ward Shielding": "1.8 GVR", "Interest Rate": "+5% LEY", "Transaction Protection": "100%" },
    description: "High-security digital banking pass issued by the ABEX Ward Banker.",
    abex: "75%",
    lore: "Anchors your wallet to high-level credit nodes. Unlocks extreme priority purchase clearance.",
    icon: Shield
  },
  {
    id: "mtd-16",
    name: "Wild Card",
    category: "Wild Unit",
    rarity: "Ultra Rare",
    priceUsd: 18.00,
    priceCents: 1800,
    stats: { "Morph Resonance": "+25%", "Adaptive Gear": "Omni", "Rigging Factor": "99%" },
    description: "A flexible silicon matrix that adapts its stats to mimic any Golem component nearby.",
    abex: "70%",
    lore: "A valuable byproduct of geothermal cooling spikes. Highly sought after by tech fitters.",
    icon: Sparkles
  },
  {
    id: "mtd-17",
    name: "MTD Wild Card",
    category: "Wild Anomaly",
    rarity: "Ultra Rare",
    priceUsd: 22.00,
    priceCents: 2200,
    stats: { "Real-time rewrite": "S-Tier", "Timeline Drift": "1.2s", "Rarity Upgrade": "+1 Tier" },
    description: "Exotic digital relic pulse that upgrades neighboring cards to supreme statuses mid-battle.",
    abex: "80%",
    lore: "Whispered to contain code remnants of pre-corruption AI algorithms. Extremely unstable.",
    icon: Sparkles
  }
];

export default function JanesGolemGuide({
  wallet = { isConnected: false, address: null, balance: "0", provider: null },
  onOpenWallet = () => {},
  onConnectWallet = () => {},
  onDisconnectWallet = () => {},
  onTriggerStripeCheckout = async () => {},
  purchaseHistory = [],
  onAddPurchase = () => {}
}: GolemGuideProps) {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  
  // Interactive ABEX-GDEX Calculator states
  const [abexValue, setAbexValue] = useState<number>(65);
  const [gdexValue, setGdexValue] = useState<number>(75);
  
  // Active selected catalog element to order/view
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<any | null>(MTD_DECK_CARDS[0]);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);
  const [checkoutMethod, setCheckoutMethod] = useState<'stripe' | 'wallet'>('stripe');
  
  // Stripe form fields (mock inputs)
  const [stripeCard, setStripeCard] = useState({ number: '4242 •••• •••• 4242', expiry: '12/28', cvc: '931' });
  const [isProcessingLocalBuy, setIsProcessingLocalBuy] = useState(false);

  // Interactive World Engine states
  const [worldFrequency, setWorldFrequency] = useState<number>(1.5);
  const [containmentActive, setContainmentActive] = useState<boolean>(true);
  const [dimensionalSync, setDimensionalSync] = useState<number>(88);

  const calculateThreatLevel = (abex: number, gdex: number) => {
    const score = (abex * 0.6) + (gdex * 0.4);
    if (score > 85) return { level: 'APOCALYPTIC', color: 'text-red-400 border-red-500/35 bg-red-500/10' };
    if (score > 70) return { level: 'CATASTROPHIC', color: 'text-purple-400 border-purple-500/35 bg-purple-500/10' };
    if (score > 50) return { level: 'SEVERE ANOMALY', color: 'text-amber-400 border-amber-500/35 bg-amber-500/10' };
    return { level: 'STABLE CORE', color: 'text-emerald-400 border-emerald-500/35 bg-emerald-500/10' };
  };

  const threat = calculateThreatLevel(abexValue, gdexValue);

  // Trigger Purchase order via either Stripe or Web3 wallet
  const handlePurchaseItem = async (item: any) => {
    setIsProcessingLocalBuy(true);
    setOrderNotification(null);
    const totalPriceCents = Math.round(item.priceUsd * orderQuantity * 100);

    try {
      if (checkoutMethod === 'stripe') {
        // Trigger global Stripe Checkout session (with standard simulator fallback)
        await onTriggerStripeCheckout(`ABEX Banker: ${item.name} (${orderQuantity}x)`, totalPriceCents);
        
        // Log locally
        onAddPurchase({
          id: `ABEX-${Math.floor(Math.random()*100000)}`,
          amount: totalPriceCents,
          status: 'succeeded',
          createdAt: new Date().toISOString(),
          description: `Ordered: ${orderQuantity}x ${item.name} via ABEX Ward Banker Stripe`
        });
        
        setOrderNotification(`✅ Catalog order of ${orderQuantity}x ${item.name} dispatched! Stripe simulator invoked.`);
      } else {
        // Web3 Wallet Connect debit flow
        if (!wallet.isConnected) {
          alert("Connect your holographic Web3 credentials first inside the ABEX Ward Banker panel!");
          onOpenWallet();
          setIsProcessingLocalBuy(false);
          return;
        }

        const currentBalance = parseFloat(wallet.balance || "0");
        const leyCost = Math.round(item.priceUsd * orderQuantity * 15); // Scale multiplier
        
        if (currentBalance < leyCost) {
          alert(`Insufficient LEY balance! Requires ${leyCost} LEY (You have ${currentBalance} LEY)`);
          setIsProcessingLocalBuy(false);
          return;
        }

        // Add transaction entry
        onAddPurchase({
          id: `LEY-${Math.floor(Math.random()*100000)}`,
          amount: totalPriceCents,
          status: 'succeeded',
          createdAt: new Date().toISOString(),
          description: `Ordered: ${orderQuantity}x ${item.name} via Wallet Connect (${leyCost} LEY)`
        });

        setOrderNotification(`✅ Web3 Sign connection verified. ${leyCost} LEY debited from Ward Banker account.`);
      }
    } catch (err) {
      console.error(err);
      setOrderNotification("❌ Connection handshake timeout. Hard retry advised.");
    } finally {
      setIsProcessingLocalBuy(false);
      setTimeout(() => setOrderNotification(null), 7000);
    }
  };

  // Filter lists based on search query and optional filters
  const filteredMtdDeck = MTD_DECK_CARDS.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || card.rarity.toLowerCase() === rarityFilter.toLowerCase();
    return matchesSearch && matchesRarity;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
      case 'ultra rare': return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
      case 'rare': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5';
      case 'uncommon': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/5';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#05060a] text-[#e4d9ff] font-sans overflow-hidden">
      
      {/* Document Header */}
      <header className="p-5 border-b border-[#2b233c] bg-[#120f1c]/40 shrink-0 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#c9b3ff] text-[8.5px] font-mono tracking-[0.25em] uppercase font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#c46a1a]" />
              <span>CLASSIFIED HYBRID BRIEFING • HORROR ENGINE FACTORIES • JANE DISTRICT</span>
            </div>
            <h1 className="text-xl md:text-2xl font-sans tracking-wide text-[#f5e6ff] uppercase font-bold">
              Jane’s Golem Manufacturing Guide
            </h1>
            <p className="text-[11px] text-[#a89dc4] max-w-2xl leading-relaxed">
              This intelligence document merges hard engineering truth with mythic infrastructure, compiled for strategic partners, investors, and internal operatives embedded in the Jane District.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 h-fit">
            {['Horror Engine Factories', 'Golem Forge', 'ABEX–GDEX', 'MTD DECK BLUEPRINTS', 'LORE RECORDS'].map((tag) => (
              <span key={tag} className="text-[7.5px] font-mono tracking-wider font-bold uppercase px-2 py-0.5 rounded border border-[#4b3b6f] bg-[#151320] text-[#c9b3ff]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Column Split */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Interactive panel: Calculator & Navigator Index */}
        <aside className="hidden md:flex w-72 border-r border-[#2b233c] bg-[#07080f]/95 flex-col p-4 shrink-0 overflow-y-auto space-y-4 custom-scrollbar">
          
          {/* Document Section Filter */}
          <div className="space-y-2">
            <span className="text-[8.5px] font-mono font-bold tracking-widest text-[#7b5cff] uppercase block">GUIDE INDEX</span>
            <div className="space-y-1">
              {[
                { id: 'all', label: '📖 FULL CODEX' },
                { id: 'canon', label: '1. CANONICAL POSITION' },
                { id: 'horror', label: '2. HORROR INTEGRATION' },
                { id: 'classes', label: '3. GOLEM CLASSES' },
                { id: 'abex', label: '4. ABEX–GDEX SYSTEM' },
                { id: 'lore_cards', label: '5. LORE CARDS DECK' },
                { id: 'mtd_decks', label: '6. MTD DECK BLUEPRINTS' },
                { id: 'world_engine', label: '🌍 WORLD ENGINE' },
                { id: 'ward_banker', label: '💰 ABEX WARD BANKER' },
                { id: 'weapons', label: 'A. WEAPONS DIVISION' },
                { id: 'logistics', label: 'B. LOGISTICS PIPELINE' },
                { id: 'protocol', label: 'E. CST‑ERT PROTOCOL' }
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    // Automatically pre-fill catalog highlight if tab changes
                    if (sec.id === 'lore_cards') setSelectedCatalogItem(LORE_CARDS_DATA[0]);
                    if (sec.id === 'mtd_decks') setSelectedCatalogItem(MTD_DECK_CARDS[0]);
                  }}
                  className={`w-full font-mono text-[9px] text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between font-bold ${
                    activeSection === sec.id
                      ? 'bg-[#c46a1a]/15 border-[#c46a1a] text-white shadow-[0_0_8px_rgba(196,106,26,0.15)]'
                      : 'bg-[#151320]/40 border-transparent text-[#a89dc4] hover:bg-[#151320] hover:text-[#f5e6ff]'
                  }`}
                >
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Calculator widget */}
          <div className="border border-[#3a304f] bg-[#120f1c]/50 rounded-xl p-3.5 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[8.5px] font-mono font-bold text-[#f5e6ff] tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 text-[#c46a1a]" />
              <span>COGNITIVE WEIGHTING</span>
            </div>
            
            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono font-bold">
                  <span className="text-slate-400">ABEX (ABYSSAL RISKS)</span>
                  <span className="text-[#c46a1a]">{abexValue}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={abexValue}
                  onChange={(e) => setAbexValue(Number(e.target.value))}
                  className="w-full accent-[#c46a1a] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono font-bold">
                  <span className="text-slate-400">GDEX (DIFF INDEX)</span>
                  <span className="text-[#c9b3ff]">{gdexValue}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={gdexValue}
                  onChange={(e) => setGdexValue(Number(e.target.value))}
                  className="w-full accent-[#7b5cff] cursor-pointer"
                />
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col gap-0.5 items-center justify-center text-center transition-all ${threat.color}`}>
              <span className="text-[7px] tracking-[0.15em] font-mono font-bold uppercase opacity-80">STABILIZED ESCALATION:</span>
              <span className="text-[10px] font-mono font-extrabold tracking-widest">{threat.level}</span>
            </div>
          </div>
        </aside>

        {/* Right main panel: Scrollable actual documentation pages */}
        <main className="flex-1 bg-[#05060a] p-6 lg:p-8 overflow-y-auto space-y-12 custom-scrollbar">
          
          {/* Mobile Navigator Index Filter bar */}
          <div className="md:hidden bg-[#120f1c] p-2.5 rounded-lg border border-[#3a304f] mb-4">
            <label className="text-[8px] font-mono font-bold tracking-wider text-[#c9b3ff] block mb-1">SELECT VIEWING SECTION:</label>
            <select
              value={activeSection}
              onChange={(e) => {
                setActiveSection(e.target.value);
                if (e.target.value === 'lore_cards') setSelectedCatalogItem(LORE_CARDS_DATA[0]);
                if (e.target.value === 'mtd_decks') setSelectedCatalogItem(MTD_DECK_CARDS[0]);
              }}
              className="w-full p-1.5 bg-[#05060a] border border-[#4b3b6f] rounded text-[#e4d9ff] font-mono text-[9px] outline-none"
            >
              <option value="all">📖 Full Codex Manual</option>
              <option value="canon">1. Canonical Position</option>
              <option value="horror">2. Horror Engine Factories Integration</option>
              <option value="classes">3. Confirmed Golem Classes</option>
              <option value="abex">4. ABEX–GDEX Weighing System</option>
              <option value="lore_cards">5. Lore Cards Deck</option>
              <option value="mtd_decks">6. MTD Deck Blueprints</option>
              <option value="world_engine">🌍 7. World Engine Core</option>
              <option value="ward_banker">💰 ABEX Ward Banker</option>
              <option value="weapons">A. Weapons Division & Upgrades</option>
              <option value="logistics">B. Logistics & Mint-to-Deploy</option>
              <option value="protocol">E. Step-by-Step Golem Creation</option>
            </select>
          </div>

          {/* 1. CANONICAL POSITION */}
          {(activeSection === 'all' || activeSection === 'canon') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION 1.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Canonical Position of the Guide</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-4 text-xs text-[#d9cfff] leading-relaxed">
                  <p><strong>Role in the universe:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Backbone reference for the Horror Engine Factories and Jane District industrial mythos.</li>
                    <li>Defines how Golems are conceived, manufactured, stabilized, and deployed into live conflict theatres.</li>
                    <li>Anchors the <strong>ABEX–GDEX</strong> weighting system for rarity, threat, and manufacturing difficult levels.</li>
                    <li>Provides investor‑grade clarity on pipelines, risk surfaces, and expansion vectors.</li>
                  </ul>
                  <p><strong>Audience:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Strategic partners and investors evaluating Golem‑based product lines.</li>
                    <li>Internal operatives, factory overseers, and pipeline engineers.</li>
                    <li>Lore custodians responsible for keeping mythic consistency across media.</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 bg-[#120f1c]/30 border-l-4 border-[#c46a1a] px-4 py-3 rounded-r-lg space-y-1">
                  <span className="text-[8px] font-mono font-bold text-[#c9b3ff] tracking-wide block">OPERATING ASSUMPTION</span>
                  <p className="text-[10.5px] italic text-[#d9cfff] leading-normal font-sans">
                    Every Golem is both a financial asset and a mythic weapon. Manufacturing decisions affect balances, battlefields, and narrative canon simultaneously.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 2. HORROR ENGINE FACTORIES INTEGRATION */}
          {(activeSection === 'all' || activeSection === 'horror') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION 2.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Horror Engine Factories Integration</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                <div className="bg-[#151320] p-4 rounded-xl border border-[#3a304f]/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white tracking-wide">
                    <Cpu className="w-4 h-4 text-[#c46a1a]" />
                    <span>2.1 Golem Forge Viewer</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    The Golem Forge is the interactive viewer and control surface where new Golems and Avatar Cards are conceived, parameterized, and pushed into the <strong>Mint‑to‑Deploy</strong> pipeline powered by  Tripo3D.
                  </p>
                  <ul className="text-[9.5px] text-[#d9cfff] space-y-0.5 mt-2 font-mono">
                    <li>• <span className="text-[#a89dc4]">Forge Inputs:</span> silhouettes, faction tokens, targets</li>
                    <li>• <span className="text-[#a89dc4]">Forge Outputs:</span> 3D assets, rig files, manifests</li>
                    <li>• <span className="text-[#a89dc4]">Rendering:</span> Tripo3D image-to-3D engine</li>
                  </ul>
                </div>

                <div className="bg-[#151320] p-4 rounded-xl border border-[#3a304f]/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white tracking-wide">
                    <Wrench className="w-4 h-4 text-[#c46a1a]" />
                    <span>2.2 Jane’s Real‑Time Guide</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    Embedded in the Forge UI is Jane’s real‑time guide: a contextual overlay that walks operators through each manufacturing phase, from alloy selection to ritual imprinting.
                  </p>
                  <ul className="text-[9.5px] text-[#d9cfff] space-y-0.5 mt-2 font-mono">
                    <li>• Alloy Forging & Siren composites</li>
                    <li>• Chitin Hybridization binding</li>
                    <li>• Power Core Stabilization & imprinting</li>
                  </ul>
                </div>

                <div className="bg-[#151320] p-4 rounded-xl border border-[#3a304f]/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white tracking-wide">
                    <Compass className="w-4 h-4 text-[#c46a1a]" />
                    <span>2.3 Multiplayer Hooks</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    The Guide is wired into <strong>Crypto‑Card‑Clash‑Multiplayer</strong> and open‑world wishlist systems, allowing manufactured Golems to appear as wildcards, boss units, or escort assets in live sessions.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 3. GOLEM CLASSES IN ECOSYSTEM */}
          {(activeSection === 'all' || activeSection === 'classes') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION 3.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Confirmed Golem Classes in the Ecosystem</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide">3.1 Siege‑Class Female Heavy Escort Golem</span>
                    <span className="text-[7.5px] px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-900 rounded font-mono">BULLWARK SILHOUETTE</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    Derived from the <strong>Sanctum Bulwark</strong> silhouette, this Golem is a cathedral‑armored escort designed to shield convoys, command nodes, and ritual sites.
                  </p>
                  <p className="text-[10.5px] text-[#d9cfff]"><strong className="text-[#c9b3ff]">Focus:</strong> Layered armor lattices, halo‑array calibration, energy shield resonance tuning.</p>
                </div>

                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide">3.2 Jousting Golem Mount</span>
                    <span className="text-[7.5px] px-2 py-0.5 bg-purple-950/40 text-[#c9b3ff] border border-[#4b3b6f] rounded font-mono">RAIL RUNNER MOTOR</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    An Abyssum‑authentic mount combining relic‑forged alloy with Siren chitin, influenced by CST Rail‑Runner transit‑military aesthetics. Built as a quadruped or hexapod with magnetic hooves.
                  </p>
                </div>

                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide block">3.3 Heavy Escort Vehicle (CTS)</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    A CTS‑pattern armored vehicle built to transport the Heavy Escort Golem and its support crew. Low-profile silhouette, convoy command layout, integrated modular docking cradle.
                  </p>
                </div>

                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide block">3.4 Flatbed Transport for Large Golems</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    A warehouse‑gloom flatbed designed for oversized Golems, already staged for FX and Tripo3D rigging under dim industrial lighting structures.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 4. ABEX–GDEX SYSTEM */}
          {(activeSection === 'all' || activeSection === 'abex') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION 4.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">ABEX–GDEX Weighting System</h2>
              </div>
              <p className="text-xs text-[#d9cfff] leading-relaxed font-sans max-w-4xl">
                The <strong>ABEX–GDEX</strong> system serves as the quantitative spine of the design guide, assigning core mathematical numeric weights to every Golem class and manufacturing decision.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">ABEX ELEMENT</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Abyssal Exposure measures deep horror density, bio-relic volatility, and timeline contamination risk.
                  </p>
                </div>
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">GDEX DIFFICULTY</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Golem Difficulty Index checks total engineering complexity, raw resource expenditure, and reactor heat cycles.
                  </p>
                </div>
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">METRIC INPUTS</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Feeds on market stats, active furnace telemetry, battlefield logs, and faction constraints.
                  </p>
                </div>
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">OUTPUTS RESULT</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Updates hierarchy status, algorithmic rarity tier codes, token price bands, and battlefield authorization.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 5. LORE CARDS DECK (ACTIVE TAB) */}
          {(activeSection === 'all' || activeSection === 'lore_cards') && (
            <section className="space-y-6" id="golem-lore-cards">
              <div className="flex items-center justify-between border-b border-[#3a304f] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION 5.0</span>
                  <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Holographic Lore Cards Catalog</h2>
                </div>
                <span className="text-[8.5px] font-mono px-2 py-0.5 border border-amber-900 bg-amber-950/20 text-amber-400 uppercase tracking-widest">ACTIVE REALM LEGER</span>
              </div>

              <p className="text-xs text-[#a89dc4] max-w-3xl leading-relaxed">
                Interact with the official operational profiles select from the World Pilots Union and the Astronomical Institute. Standardize allocations in the Jane District below:
              </p>

              {/* Grid of Lore Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LORE_CARDS_DATA.map((card) => (
                  <div key={card.id} className="bg-[#120f1c]/30 rounded-xl border border-[#2b233c] overflow-hidden flex flex-col hover:border-[#c46a1a]/50 transition duration-300">
                    <div className="h-44 relative bg-slate-900/60 flex items-center justify-center overflow-hidden">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover opacity-80 hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] to-transparent" />
                      <span className={`absolute top-3 right-3 text-[8.5px] font-mono tracking-wider font-extrabold uppercase px-2.5 py-0.5 rounded border ${getRarityColor(card.rarity)}`}>
                        {card.rarity}
                      </span>
                      <span className="absolute bottom-3 left-3 text-[10px] font-mono tracking-wider font-bold text-amber-400 bg-black/70 px-2 py-0.5 rounded border border-amber-900/40">
                        {card.faction}
                      </span>
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-sans font-bold text-white tracking-wide">{card.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono italic">"{card.lore}"</p>
                        
                        {/* Abilities tags */}
                        <div className="flex flex-wrap gap-1">
                          {card.abilities.map((ab, i) => (
                            <span key={i} className="text-[7.5px] font-mono bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 px-1.5 py-0.5 rounded">
                              ⬡ {ab}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats columns */}
                      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#2b233c] text-[9.5px]">
                        <div className="bg-black/40 p-1.5 rounded text-center border border-[#1e1a2f]">
                          <span className="text-[7.5px] text-slate-500 block uppercase font-mono">ATK</span>
                          <span className="text-red-400 font-bold">{card.stats.atk.toLocaleString()}</span>
                        </div>
                        <div className="bg-black/40 p-1.5 rounded text-center border border-[#1e1a2f]">
                          <span className="text-[7.5px] text-slate-500 block uppercase font-mono">DEF</span>
                          <span className="text-cyan-400 font-bold">{card.stats.def.toLocaleString()}</span>
                        </div>
                        <div className="bg-black/40 p-1.5 rounded text-center border border-[#1e1a2f]">
                          <span className="text-[7.5px] text-slate-500 block uppercase font-mono">SPEED</span>
                          <span className="text-emerald-400 font-bold">{card.stats.speed}</span>
                        </div>
                        <div className="bg-black/40 p-1.5 rounded text-center border border-[#1e1a2f]">
                          <span className="text-[7.5px] text-slate-500 block uppercase font-mono">RANK</span>
                          <span className="text-purple-400 font-bold">{card.stats.rank}</span>
                        </div>
                      </div>

                      {/* Select & purchase button */}
                      <div className="flex items-center gap-2 pt-1.5">
                        <button 
                          onClick={() => {
                            setSelectedCatalogItem(card);
                            setActiveSection('ward_banker');
                          }}
                          className="flex-1 py-1.5 bg-[#c46a1a]/10 hover:bg-[#c46a1a]/25 border border-[#c46a1a]/30 rounded text-[9.5px] font-mono text-[#f5e6ff] text-center tracking-wider transition cursor-pointer"
                        >
                          ORDER CATALOG {card.rarity === 'Legendary' ? '★' : '✦'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. MTD DECK BLUEPRINTS (ACTIVE TAB FOR DECK BUILDING) */}
          {(activeSection === 'all' || activeSection === 'mtd_decks') && (
            <section className="space-y-6" id="mtd-deck-blueprints">
              <div className="flex items-center justify-between border-b border-[#3a304f] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION 6.0</span>
                  <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Mint‑to‑Deploy (MTD) Deck Blueprints</h2>
                </div>
                <span className="text-[8.5px] font-mono px-2.5 py-0.5 border border-cyan-800 bg-cyan-950/20 text-cyan-400 uppercase tracking-widest font-extrabold">17/17 COMPLETED SECTOR ASSETS</span>
              </div>

              <div className="p-4 bg-[#120f1c]/40 border border-[#2b233c] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">ABEX DECK HARMONIZER ACTIVE</h3>
                  <p className="text-[10.5px] text-slate-400 leading-normal max-w-xl">
                    Every factory-sealed Golem Deck arrives with exactly the seventeen physical nodes tracked globally inside the Jane district rail ledger. Use controls to search, filter, and order catalogs for each.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search card deck..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-black border border-[#2b233c] text-white font-mono text-[9.5px] rounded-lg outline-none focus:border-[#c46a1a] transition w-44"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <Filter className="w-3 h-3 text-[#c46a1a]" />
                    <select
                      value={rarityFilter}
                      onChange={(e) => setRarityFilter(e.target.value)}
                      className="bg-black border border-[#2b233c] text-[#a89dc4] font-mono text-[9.5px] p-1 rounded-md outline-none focus:border-[#c46a1a]"
                    >
                      <option value="all">ANY RARITY</option>
                      <option value="common">COMMON</option>
                      <option value="uncommon">UNCOMMON</option>
                      <option value="rare">RARE</option>
                      <option value="ultra rare">ULTRA RARE</option>
                      <option value="legendary">LEGENDARY</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interactive cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {filteredMtdDeck.map((card) => {
                  const ItemIcon = card.icon;
                  return (
                    <div 
                      key={card.id} 
                      className={`p-4 bg-[#090a10] rounded-xl border overflow-hidden flex flex-col justify-between transition duration-200 ${
                        selectedCatalogItem?.id === card.id ? 'border-[#c46a1a] bg-[#120f1c]/10 ring-1 ring-[#c46a1a]/30' : 'border-[#2b233c] hover:border-[#4b3b6f]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                              <ItemIcon className="w-4 h-4 text-[#c46a1a]" />
                            </div>
                            <div>
                              <h4 className="text-xs font-sans font-bold text-white tracking-wide">{card.name}</h4>
                              <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block">{card.category}</span>
                            </div>
                          </div>
                          
                          <span className={`text-[7.5px] font-mono px-2 py-0.5 border uppercase rounded font-extrabold ${getRarityColor(card.rarity)}`}>
                            {card.rarity}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-normal">{card.description}</p>
                        
                        <div className="p-2 bg-black/60 rounded border border-[#1a1429] font-mono text-[8.5px] space-y-1">
                          <div className="text-[7px] text-slate-500 uppercase tracking-widest border-b border-[#2b233c] pb-0.5 mb-1 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-[#c46a1a]" /> LEY LINE TRANSMISSION STATS
                          </div>
                          {Object.entries(card.stats).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-400">{k}:</span>
                              <span className="text-white font-bold">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#2b233c]/80 mt-3 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[7.5px] text-slate-500 font-mono uppercase">ABEX RISK</span>
                          <span className="text-[10px] font-mono text-amber-500 font-bold">{card.abex} Factor</span>
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedCatalogItem(card);
                            setActiveSection('ward_banker');
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-slate-900 to-[#120f1c] hover:from-[#c46a1a]/10 hover:to-[#c46a1a]/20 border border-[#2b233c] hover:border-[#c46a1a] rounded text-[9px] font-mono text-[#f5e6ff] transition cursor-pointer"
                        >
                          Order Catalog
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredMtdDeck.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-black/40 border border-dashed border-[#2b233c] rounded-xl font-mono text-xs text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-700 mx-auto mb-2 animate-bounce" />
                    No cards matching searching parameters found inside the 17 completed blueprints database.
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 7. WORLD ENGINE (ACTIVE STRATEGIC CONTROLLER) */}
          {(activeSection === 'all' || activeSection === 'world_engine') && (
            <section className="space-y-6" id="golem-world-engine">
              <div className="flex items-center justify-between border-b border-[#7b5cff]/40 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#7b5cff] drop-shadow-[0_0_8px_#7b5cff]" />
                  <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">
                    Section 7.0: World Engine Core & Tectonic Drivers
                  </h2>
                </div>
                <span className="text-[8.5px] font-mono px-2 py-0.5 border border-purple-900 bg-purple-950/20 text-purple-400 uppercase tracking-widest font-extrabold">
                  {containmentActive ? 'SHIELDING STABLE' : 'SHIELD BREAKDOWN'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Information and Lore column */}
                <div className="lg:col-span-7 space-y-4 text-xs text-[#d9cfff] leading-relaxed">
                  <div className="p-4 bg-[#120f1c]/45 rounded-xl border border-[#2b233c] space-y-2">
                    <h3 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">7.1 Tectonic & Leyline Calibration</h3>
                    <p className="text-[#a89dc4]">
                      The <strong>World Engine</strong> sits deep within the basalt folds of the Jane District. It is the core power plant that maintains physical timeline cohesion across Corgemont Station and stabilizes the geothermal flows required by the <strong>Horror Engine Factories</strong>.
                    </p>
                    <p className="text-[#a89dc4]">
                      Without precise micro-calibration, high-frequency Golem forging cycles threaten to destabilize regional leyline links, triggering spontaneous Abyssal leaks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                      <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">DIMENSIONAL HARMONY</span>
                      <p className="text-[10.5px] text-slate-400 leading-normal">
                        Maintains spatial congruence at {dimensionalSync}% sync index. Adjust frequencies to match active tectonic shifts.
                      </p>
                    </div>

                    <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                      <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">ABYSSAL ISOLATION</span>
                      <p className="text-[10.5px] text-slate-400 leading-normal">
                        Active protective warding locks down dimensional drift, guarding standard Golem blueprints from corrupted feedback loop noise.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-black/40 rounded-xl border border-[#2b233c] space-y-3">
                    <span className="text-[8px] font-mono text-[#8e806a] uppercase tracking-widest block font-bold">SYSTEM TELEMETRY REPORT</span>
                    <div className="space-y-2 text-[10px] font-mono">
                      <div className="flex justify-between border-b border-[#211a12]/50 pb-1">
                        <span className="text-slate-500">ENGINE STATUS:</span>
                        <span className={worldFrequency > 4.0 ? 'text-red-400 font-extrabold animate-pulse' : 'text-emerald-400 font-extrabold'}>
                          {worldFrequency > 4.0 ? '⚠ SEVERE OVERDRIVE' : '● REGULATED COHESION'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#211a12]/50 pb-1">
                        <span className="text-slate-500">CORE DISSIPATION FLUX:</span>
                        <span className="text-amber-500">{(worldFrequency * 185.4).toFixed(1)} T/Wb</span>
                      </div>
                      <div className="flex justify-between border-b border-[#211a12]/50 pb-1">
                        <span className="text-slate-500">RESONATOR INTENSITY:</span>
                        <span className="text-cyan-400">{(worldFrequency * 12.5).toFixed(2)} dBm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">TECTONIC SYMMETRY:</span>
                        <span className="text-purple-400 font-extrabold">{(100 - Math.abs(2.5 - worldFrequency) * 15).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Controller Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#121008] border border-[#c46a1a]/20 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-1.5 text-[8.5px] font-mono font-bold text-white uppercase tracking-widest">
                      <Cpu className="w-4 h-4 text-[#c46a1a]" />
                      <span>ENGINE CORE CONSOLE</span>
                    </div>

                    <div className="space-y-4">
                      {/* Control 1: Frequency slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-mono font-bold">
                          <span className="text-slate-400">CORE DRIVER FREQUENCY</span>
                          <span className="text-[#c46a1a] font-black">{worldFrequency.toFixed(2)} Hz</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="5.0"
                          step="0.05"
                          value={worldFrequency}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setWorldFrequency(val);
                            // Adjust dimensional sync based on proximity to sweet spot (2.5Hz)
                            const accuracy = 100 - Math.abs(2.5 - val) * 12;
                            setDimensionalSync(Math.max(25, Math.min(100, Math.round(accuracy))));
                          }}
                          className="w-full accent-[#c46a1a] cursor-pointer"
                        />
                        <div className="flex justify-between text-[6.5px] text-slate-500 font-mono">
                          <span>0.5Hz [MIN]</span>
                          <span className="text-purple-400">2.5Hz [OPTIMAL]</span>
                          <span>5.0Hz [MAX]</span>
                        </div>
                      </div>

                      {/* Control 2: Dimensional Sync modifier */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono font-bold">
                          <span className="text-slate-400">DIMENSIONAL SYNC TARGET</span>
                          <span className="text-cyan-400">{dimensionalSync}%</span>
                        </div>
                        <div className="w-full bg-[#05060a] border border-[#2b233c] h-3.5 rounded overflow-hidden p-[2px] flex">
                          <div 
                            className={`h-full rounded-sm transition-all duration-300 ${
                              dimensionalSync > 85 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                              dimensionalSync > 60 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]' :
                              'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                            }`}
                            style={{ width: `${dimensionalSync}%` }}
                          />
                        </div>
                      </div>

                      {/* Control 3: Shield switch button */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#211a12] gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-white block">ABYSSAL ISOLATION SHIELD</span>
                          <p className="text-[8px] text-slate-500">Toggles defensive containment envelope around the factories.</p>
                        </div>
                        <button
                          onClick={() => setContainmentActive(!containmentActive)}
                          className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold border transition-all cursor-pointer ${
                            containmentActive
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 hover:border-emerald-400'
                              : 'bg-red-950/20 border-red-500/40 text-red-400 hover:border-red-400 animate-pulse'
                          }`}
                        >
                          {containmentActive ? 'SECURED [ON]' : 'OFFLINE [WARN]'}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Warning Callout */}
                  {worldFrequency > 4.0 && (
                    <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-[9.5px] font-mono select-none animate-slide-in flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                      <div>
                        <strong className="block uppercase font-bold">WARNING: THERMAL RESISTANCE OVERLOAD</strong>
                        <span>Extreme core frequencies are destabilizing the lower basalt strata! Dial down core drivers immediately to preserve structural integrity.</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </section>
          )}

          {/* 💰 ABEX WARD BANKER (ACTIVE PURCHASE / WALLET / STRIPE PORTAL) */}
          {(activeSection === 'all' || activeSection === 'ward_banker') && (
            <section className="space-y-6" id="abex-ward-banker">
              <div className="flex items-center justify-between border-b border-[#c46a1a]/40 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#c46a1a] drop-shadow-[0_0_8px_#c46a1a]" />
                  <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">
                    ABEX Ward Banker & Treasury
                  </h2>
                </div>
                <span className="text-[8.5px] font-mono px-2 py-0.5 border border-amber-500 bg-amber-500/10 text-amber-500 uppercase tracking-widest font-bold animate-pulse">
                  FURNACE CONNECTIONS SYNCHRONIZED
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Ward Banker state details */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Web3 wallet connect syncer card */}
                  <div className="bg-[#121008] border border-[#c46a1a]/30 rounded-xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-mono bg-[#c46a1a]/10 text-[#c46a1a] border border-[#c46a1a]/20 px-2 py-0.5 rounded tracking-wide uppercase font-bold">
                          SECURE LEY CONNECT NODE
                        </span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Holographic Wallet Connect Interface</h3>
                        <p className="text-[10px] text-slate-400">
                          Mapping on-chain account signatures validates deployment balance scales across southern line networks.
                        </p>
                      </div>

                      {/* Display connection trigger */}
                      {wallet.isConnected && wallet.address ? (
                        <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-[#c46a1a]/20">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-[9.5px] font-mono text-slate-300 truncate max-w-[120px]">
                            {wallet.address}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={onOpenWallet}
                          className="px-4 py-2 bg-[#c46a1a] hover:bg-[#a67c2a] text-white text-xs font-mono font-bold uppercase rounded-lg tracking-wider transition cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(196,106,26,0.3)] select-none"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>CONNECT WALLET</span>
                        </button>
                      )}
                    </div>

                    {/* Mini balances review */}
                    <div className="grid grid-cols-3 gap-3 text-center border-t border-[#2e2418] pt-4 text-[10px] font-mono">
                      <div className="p-2 bg-black/40 rounded border border-[#2b233c]">
                        <span className="text-slate-500 block uppercase text-[7.5px] tracking-wide">LEY BALANCE</span>
                        <span className="text-amber-400 font-bold text-xs">{wallet.balance || "0.0"} LEY</span>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-[#2b233c]">
                        <span className="text-slate-500 block uppercase text-[7.5px] tracking-wide">PENDING SHIELDS</span>
                        <span className="text-indigo-400 font-bold text-xs">9 Custom Cores</span>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-[#2b233c]">
                        <span className="text-slate-500 block uppercase text-[7.5px] tracking-wide">ABEX FEE EXPOSURE</span>
                        <span className="text-emerald-400 font-bold text-xs">0.05% Discount</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights the ordered card selector */}
                  {selectedCatalogItem && (
                    <div className="bg-[#0b0c10] border border-[#2b233c] rounded-xl p-5 space-y-4">
                      
                      <div className="flex items-start justify-between border-b border-[#2b233c] pb-3.5">
                        <div className="space-y-1">
                          <span className="text-[7.5px] font-mono text-purple-400 uppercase tracking-widest block">SELECTED TRANSACTION LEDGER</span>
                          <h4 className="text-base font-bold text-white tracking-wide">{selectedCatalogItem.name}</h4>
                          <p className="text-[10px] text-slate-400">{selectedCatalogItem.description || selectedCatalogItem.lore}</p>
                        </div>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${getRarityColor(selectedCatalogItem.rarity)}`}>
                          {selectedCatalogItem.rarity}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Transaction parameters configuration */}
                        <div className="space-y-3 font-mono text-[10px]">
                          <div className="bg-black/60 p-3 rounded-lg border border-[#2b233c]">
                            <span className="text-[7.5px] text-slate-500 block uppercase">Base Node Sizing Rate:</span>
                            <p className="text-xs font-bold text-white mt-0.5">${selectedCatalogItem.priceUsd ? selectedCatalogItem.priceUsd.toFixed(2) : "15.00"} USD</p>
                          </div>

                          <div className="flex gap-2 items-center">
                            <span className="text-slate-400">Order Quantity:</span>
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                                className="w-5 h-5 bg-black border border-[#2b233c] rounded text-white flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                              >
                                -
                              </button>
                              <span className="text-white text-xs font-bold w-4 text-center">{orderQuantity}</span>
                              <button 
                                onClick={() => setOrderQuantity(prev => prev + 1)}
                                className="w-5 h-5 bg-black border border-[#2b233c] rounded text-white flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Total calculation */}
                          <div className="bg-[#121008] p-3 rounded-lg border border-[#c46a1a]/20">
                            <div className="flex justify-between items-center text-[10.5px]">
                              <span className="text-slate-400 uppercase">ABEX PAY ESTIMATION:</span>
                              <span className="text-white font-extrabold">${(selectedCatalogItem.priceUsd * orderQuantity).toFixed(2)} USD</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-[#c46a1a] mt-1 border-t border-[#c46a1a]/15 pt-1">
                              <span>OR IN LEY RESOC:</span>
                              <span>{Math.round(selectedCatalogItem.priceUsd * orderQuantity * 15)} LEY Tokens</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Checkout methods option select */}
                        <div className="bg-black/50 p-4 border border-[#2b233c] rounded-xl flex flex-col justify-between space-y-4 select-none">
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider">CHOOSE ROUTING SHAKE:</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => setCheckoutMethod('stripe')}
                                className={`py-1.5 rounded text-[10px] font-mono font-bold uppercase cursor-pointer border tracking-wide transition duration-150 flex items-center justify-center gap-1 ${
                                  checkoutMethod === 'stripe' ? 'bg-[#c46a1a]/15 text-[#c46a1a] border-[#c46a1a]' : 'bg-black/40 border-[#2b233c] text-purple-400'
                                }`}
                              >
                                <CreditCard className="w-3 h-3" /> Stripe
                              </button>
                              <button 
                                onClick={() => setCheckoutMethod('wallet')}
                                className={`py-1.5 rounded text-[10px] font-mono font-bold uppercase cursor-pointer border tracking-wide transition duration-150 flex items-center justify-center gap-1 ${
                                  checkoutMethod === 'wallet' ? 'bg-[#c46a1a]/15 text-[#c46a1a] border-[#c46a1a]' : 'bg-black/40 border-[#2b233c] text-[#7b5cff]'
                                }`}
                              >
                                <Wallet className="w-3-5 h-3-5" /> Web3
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3.5">
                            {checkoutMethod === 'stripe' ? (
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono text-slate-600 block">CARD TUNNEL METRIC: STRIPE SIMULATED</span>
                                <div className="text-[9.5px] font-mono text-slate-400 bg-black/80 px-2 py-1 rounded border border-[#2e2418] flex items-center justify-between">
                                  <span>{stripeCard.number}</span>
                                  <span>{stripeCard.expiry}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className={`text-[8px] font-mono block ${wallet.isConnected ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`}>
                                  {wallet.isConnected ? '● SYSTEM NODES AUTHORIZED' : '⚠ ACCESS WAITING HANDSHAKE'}
                                </span>
                                <p className="text-[9px] text-[#a89dc4]">Will deduct from LEY index directly upon digital signature sign.</p>
                              </div>
                            )}

                            <button
                              onClick={() => handlePurchaseItem(selectedCatalogItem)}
                              disabled={isProcessingLocalBuy}
                              className="w-full py-2 bg-[#c46a1a] hover:bg-[#a67c2a] disabled:opacity-30 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer shadow-[0_0_12px_rgba(196,106,26,0.3)]"
                            >
                              {isProcessingLocalBuy ? (
                                <span className="flex items-center justify-center gap-2 animate-pulse">
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> PACKING ASSET STRIPE...
                                </span>
                              ) : (
                                `CONFIRM ${checkoutMethod === 'stripe' ? 'STRIPE' : 'WEB3'} ORDER`
                              )}
                            </button>
                          </div>

                        </div>
                      </div>

                      {orderNotification && (
                        <div className="p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 rounded-xl text-[10px] font-mono select-none animate-slide-in">
                          {orderNotification}
                        </div>
                      )}

                    </div>
                  )}

                  {/* Complete purchase table records matching real updates */}
                  <div className="bg-[#080604] border border-[#2b233c] rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                      ABEX Ward Banker Transaction Ledger Logs
                    </h4>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {purchaseHistory && purchaseHistory.length > 0 ? (
                        purchaseHistory.map((log: any) => (
                          <div key={log.id} className="p-3 bg-black/60 rounded-lg border border-[#2c223c] flex justify-between items-center font-mono text-[9.5px]">
                            <div className="space-y-1">
                              <p className="text-white font-bold">{log.description}</p>
                              <p className="text-[8px] text-slate-500">TRANSACTION INDEX: {log.id} &bull; {new Date(log.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-white font-bold">${(log.amount / 100).toFixed(2)} USD</span>
                              <span className="text-[8px] text-[#c46a1a] block uppercase">{log.status}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-[10.5px] font-mono text-slate-600 border border-dashed border-[#201a2e] rounded-lg">
                          No recent transactions recorded under this identity registry. Proceed with ordering catalogs!
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Vertical products quick selection list */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-[#121008] border border-[#c46a1a]/20 rounded-xl p-4 space-y-3.5">
                    <div className="flex items-center gap-1.5 text-[8.5px] font-mono font-bold text-white uppercase tracking-widest">
                      <ShoppingCart className="w-4 h-4 text-[#c46a1a]" />
                      <span>TREASURY CATALOG</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider">Holographic Lore Cards:</span>
                      <div className="space-y-1.5">
                        {LORE_CARDS_DATA.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedCatalogItem(item);
                              setOrderQuantity(1);
                            }}
                            className={`w-full p-2 rounded border font-mono text-[9px] transition text-left flex items-center justify-between cursor-pointer ${
                              selectedCatalogItem?.id === item.id ? 'bg-[#c46a1a]/15 border-[#c46a1a] text-white' : 'bg-black/60 border-[#2b233c] text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="truncate max-w-[120px]">{item.name}</span>
                            <span className="text-amber-500 font-bold">${item.priceUsd.toFixed(2)}</span>
                          </button>
                        ))}
                      </div>

                      <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider pt-2">MTD 17-Deck Card Assets:</span>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                        {MTD_DECK_CARDS.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedCatalogItem(item);
                              setOrderQuantity(1);
                            }}
                            className={`w-full p-2 rounded border font-mono text-[9px] transition text-left flex items-center justify-between cursor-pointer ${
                              selectedCatalogItem?.id === item.id ? 'bg-[#c46a1a]/15 border-[#c46a1a] text-white' : 'bg-black/60 border-[#2b233c] text-slate-400 hover:border-[#4b3b6f]'
                            }`}
                          >
                            <span className="truncate max-w-[140px]">⬡ {item.name}</span>
                            <span className="text-amber-400 font-bold">${item.priceUsd.toFixed(2)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* A. WEAPONS DIVISION */}
          {(activeSection === 'all' || activeSection === 'weapons') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION A.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider font-bold">Weapons Division & Golem Manufacturing</h2>
              </div>

              <div className="space-y-4 text-xs text-[#d9cfff] leading-relaxed">
                <div>
                  <h3 className="text-[11px] font-sans font-bold text-[#f5e6ff] uppercase tracking-wider mb-1">A.1 Mandate & Scope</h3>
                  <p className="text-[#a89dc4]">
                    The Weapons Division handles loadouts, chassis armature customization, relic augmentation, and all absolute safety containments built around volatile central energy cores.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#120f1c]/25 rounded-xl border border-[#3a304f]/60 space-y-2">
                    <h4 className="font-bold text-white text-[10px] uppercase">A.2 Weaponized Golem Variants</h4>
                    <ul className="space-y-1.5 text-[10px] text-[#a89dc4]">
                      <li>
                        <strong className="text-white">Siege-Class "Cathedral Lance":</strong> Adds forward‑projected kinetic lances and glowing energy halo-beam lines.
                      </li>
                      <li>
                        <strong className="text-white">Jousting Mount "Rail-Joust":</strong> Integrates dynamic chassis kinetic rigs, spine lance triggers, and impact-dampening harnesses.
                      </li>
                      <li>
                        <strong className="text-white">CTS Vehicle "Convoy Bastion":</strong> Mounts multi-directional turreted hardpoints, field shield generators, and target synchronizers.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-[#120f1c]/25 rounded-xl border border-[#3a304f]/60 space-y-2">
                    <h4 className="font-bold text-white text-[10px] uppercase">A.3 Modular Armatures & Lineage</h4>
                    <p className="text-[10px] text-[#a89dc4]">
                      Weapon systems dock through circular armature rings around the spine and hips.
                    </p>
                    <p className="text-[10px] text-[#a89dc4]">
                      <strong>Power Core Lineages</strong> are split strictly between <em>Relic Cores</em> (highly volatile), <em>Transit Cores</em> (CST efficient generators), and <em>Siren Cores</em> (organic, whisper‑reactive chitin links).
                    </p>
                  </div>
                </div>

                <div className="bg-[#151320] border border-[#4b3b6f]/30 p-4 rounded-xl space-y-2">
                  <h3 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">A.5 Hybrid Doctrine, CST Design & Safety</h3>
                  <p className="text-[10.5px] text-[#a89dc4]">
                    The Weapons Division stabilizes designs using the Cinematic Systems Transit (CST) visual vocabulary. Standardizing hazard striping, yellow line indicators, and magnetic rail couplers prevents accidental activation of volatile Relic cores.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center text-[9px] font-mono uppercase mt-2">
                    <div className="p-1 border border-[#3a304f] rounded">CONTAINMENT RINGS REQUIRED</div>
                    <div className="p-1 border border-[#3a304f] rounded">FAIL-SAFE RUNES INSCRIPTED</div>
                    <div className="p-1 border border-[#3a304f] rounded">ABEX EXPOSURE CAPS INSTALLED</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* B. LOGISTICS */}
          {(activeSection === 'all' || activeSection === 'logistics') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION B.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider font-bold">Logistics & Mint‑to‑Deploy (Tripo3D)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#120f1c]/30 p-4 border border-[#2b233c] rounded-xl space-y-1.5">
                  <span className="text-[8.5px] font-mono text-[#c9b3ff] tracking-[0.2em] font-bold block uppercase">B.1 PIPELINE STEPS</span>
                  <ol className="text-[10px] text-[#a89dc4] list-decimal pl-4.5 space-y-1">
                    <li>Concept Silhouette drafting</li>
                    <li>Tripo3D Prototype generation</li>
                    <li>Symmetry & rigging validation</li>
                    <li>Lore & cognitive template binding</li>
                  </ol>
                </div>
                <div className="bg-[#120f1c]/30 p-4 border border-[#2b233c] rounded-xl space-y-1.5">
                  <span className="text-[8.5px] font-mono text-[#c9b3ff] tracking-[0.2em] font-bold block uppercase">B.2 MINT-TO-DEPLOY CONTRACTS</span>
                  <p className="text-[10px] text-[#a89dc4] leading-relaxed">
                    Mtd smart contracts encapsulate ownership keys, dynamic stat upgrades, and live theater operational clearances.
                  </p>
                </div>
                <div className="bg-[#120f1c]/30 p-4 border border-[#2b233c] rounded-xl space-y-1.5">
                  <span className="text-[8.5px] font-mono text-[#c9b3ff] tracking-[0.2em] font-bold block uppercase">B.3 TELEMETRY FEEDBACK</span>
                  <p className="text-[10px] text-[#a89dc4] leading-relaxed">
                    Actual factory fabrication rates feed back into ABEX levels, automatically compensating values for the next blueprint generation run.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* E. STEP-BY-STEP GOLEM CREATION PROTOCOL */}
          {(activeSection === 'all' || activeSection === 'protocol') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#c46a1a] font-mono font-bold">SECTION E.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider font-bold">Step‑by‑Step Golem Creation Protocol (CST‑ERT Train Escort)</h2>
              </div>
              <div className="bg-[#151320] border-l-4 border-[#c46a1a] p-4 rounded-r-xl space-y-2">
                <p className="text-xs text-[#d9cfff] font-sans leading-relaxed">
                  Below is the verified, sequential, multi-stage protocol optimized for the core <strong>CST-ERT rail system combat escort</strong>:
                </p>
                <div className="space-y-2 mt-4 font-mono text-[9.5px]">
                  {[
                    { s: '1', title: 'Define Escort Doctrine & ABEX–GDEX Balance Band targets for the localized route segment.' },
                    { s: '2', title: 'Draft CST-ERT Silhouette utilizing train hazard striping and coupling adapters.' },
                    { s: '3', title: 'Feed prompt tokens to Tripo3D modeler to render initial mesh geometries.' },
                    { s: '4', title: 'Forge structural core frame, texturing organic Siren composites on top.' },
                    { s: '5', title: 'Anchor Transit-lineage Power Core calibrating dynamic surge output capacity.' },
                    { s: '6', title: 'Equip track-sweeper lances and lateral energy shields along the armature arrays.' },
                    { s: '7', title: 'Run high-order behavioral imprinting to lock route coordinates and priorities.' },
                    { s: '8', title: 'Trigger stability test cycles in simulated bad weather / EMP environments.' },
                    { s: '9', title: 'Seal the factory fabrication log, sign the Mint-to-Deploy lease, and dispatch.' }
                  ].map((step) => (
                    <div key={step.s} className="flex gap-2 items-start text-[#a89dc4] hover:text-[#e4d9ff] transition-all">
                      <span className="text-[#c46a1a] font-extrabold border border-[#c46a1a]/30 bg-[#c46a1a]/10 rounded w-4.5 h-4.5 flex items-center justify-center text-[8.5px] scale-95 shrink-0">{step.s}</span>
                      <span className="leading-tight pt-0.5">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
