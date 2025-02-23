import { X } from 'lucide-react';
import type { Wallet } from '../types';

interface WalletModalProps {
  wallet: Wallet;
  onClose: () => void;
}

export function WalletModal({ wallet, onClose }: WalletModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Wallet Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <p className="text-white">{wallet.name}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-400">Platform</label>
            <p className="text-white">{wallet.platform}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-400">Chain</label>
            <p className="text-white">{wallet.chain}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-400">Purpose</label>
            <p className="text-white">{wallet.purpose}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-400">Address</label>
            <p className="text-white break-all">{wallet.address}</p>
          </div>
          
          {wallet.privateKey && (
            <div>
              <label className="text-sm text-gray-400">Private Key</label>
              <p className="text-white break-all">{wallet.privateKey}</p>
            </div>
          )}
          
          {wallet.email && (
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-white">{wallet.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}