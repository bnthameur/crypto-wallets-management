import { X } from 'lucide-react';
import React, { useState } from 'react';
import type { Chain, Platform, Wallet } from '../types';
import { CHAINS, PLATFORMS } from '../types';
import { supabase } from '../lib/supabase';

interface AddWalletModalProps {
  onClose: () => void;
  onAdd: (wallet: Omit<Wallet, 'id'>) => void;
}

export function AddWalletModal({ onClose, onAdd }: AddWalletModalProps) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('Binance');
  const [purpose, setPurpose] = useState('');
  const [chain, setChain] = useState<Chain>('BNB');
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to add a wallet');
      return;
    }

    const newWallet = {
      user_id: user.id,
      name,
      platform,
      purpose,
      chain,
      address,
      private_key: privateKey || null,
      email: email || null,
    };

    onAdd(newWallet);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add New Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">Chain</label>
            <select
              value={chain}
              onChange={(e) => setChain(e.target.value as Chain)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              {CHAINS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Private Key (Optional)
            </label>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Add Wallet
          </button>
        </form>
      </div>
    </div>
  );
}