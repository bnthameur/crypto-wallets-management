import React, { useState, useEffect } from 'react';
import { LogOut, Plus } from 'lucide-react';
import { WalletCard } from './components/WalletCard';
import { WalletModal } from './components/WalletModal';
import { AddWalletModal } from './components/AddWalletModal';
import { LoginPage } from './components/LoginPage';
import type { Chain, Platform, Wallet } from './types';
import { CHAINS, PLATFORMS } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set());
  const [selectedChains, setSelectedChains] = useState<Set<Chain>>(new Set());

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      if (data.session) {
        fetchWallets();
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchWallets();
      } else {
        setWallets([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchWallets = async () => {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wallets:', error);
      return;
    }

    setWallets(data || []);
  };

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setWallets([]);
  };

  const handleAddWallet = async (newWallet: Omit<Wallet, 'id'>) => {
    const { error } = await supabase
      .from('wallets')
      .insert([newWallet]);

    if (error) {
      alert('Error adding wallet: ' + error.message);
      return;
    }

    setShowAddWallet(false);
    fetchWallets();
  };

  const handleDeleteWallet = async (walletId: string) => {
    const { error } = await supabase
      .from('wallets')
      .delete()
      .match({ id: walletId });

    if (error) {
      alert('Error deleting wallet: ' + error.message);
      return;
    }

    setWallets(wallets.filter(wallet => wallet.id !== walletId));
  };

  const togglePlatform = (platform: Platform) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

  const toggleChain = (chain: Chain) => {
    const newSelected = new Set(selectedChains);
    if (newSelected.has(chain)) {
      newSelected.delete(chain);
    } else {
      newSelected.add(chain);
    }
    setSelectedChains(newSelected);
  };

  const filteredWallets = wallets.filter(wallet => {
    if (selectedPlatforms.size > 0 && !selectedPlatforms.has(wallet.platform)) return false;
    if (selectedChains.size > 0 && !selectedChains.has(wallet.chain)) return false;
    return true;
  });

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 font-['Arial'] relative">
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl font-semibold text-white">My Crypto Wallets</h1>
      <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          <LogOut size={16} />
        </button>
        <button
          onClick={handleLogout}
          className="md:hidden fixed top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>

    <div className="mb-6 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Platforms</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(platform => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                selectedPlatforms.has(platform)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Chains</label>
        <div className="flex flex-wrap gap-2">
          {CHAINS.map(chain => (
            <button
              key={chain}
              onClick={() => toggleChain(chain)}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                selectedChains.has(chain)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredWallets.map(wallet => (
        <WalletCard
          key={wallet.id}
          wallet={wallet}
          onClick={() => setSelectedWallet(wallet)}
          onDelete={handleDeleteWallet}
        />
      ))}
    </div>

    {selectedWallet && (
      <WalletModal
        wallet={selectedWallet}
        onClose={() => setSelectedWallet(null)}
      />
    )}

    {showAddWallet && (
      <AddWalletModal
        onClose={() => setShowAddWallet(false)}
        onAdd={handleAddWallet}
      />
    )}
  </div>
  
  <button
    onClick={() => setShowAddWallet(true)}
    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
  >
    <Plus size={24} />
  </button>
</div>


  );
}

export default App;
