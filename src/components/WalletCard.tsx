import { Copy, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import type { Wallet } from '../types';

interface WalletCardProps {
  wallet: Wallet;
  onClick: () => void;
  onDelete: (walletId: string) => void;
}

export function WalletCard({ wallet, onClick, onDelete }: WalletCardProps) {
  const [copied, setCopied] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    onDelete(wallet.id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-shadow duration-200 border border-gray-700"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{wallet.name}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAddress}
              className="text-gray-400 hover:text-gray-200 p-1 rounded transition-colors duration-200"
              title="Copy address"
            >
              {copied ? (
                <span className="text-green-400 text-sm">Copied!</span>
              ) : (
                <Copy size={16} />
              )}
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-400 p-1 rounded transition-colors duration-200"
              title="Delete wallet"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded">
              {wallet.platform}
            </span>
            <span className="px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-300 rounded">
              {wallet.chain}
            </span>
          </div>
          
          <p className="text-gray-400 truncate" title={wallet.address}>
            {wallet.address}
          </p>
          
          <p className="text-gray-500">{wallet.purpose}</p>
        </div>
        
        <div className="mt-3 flex items-center text-blue-400 text-sm">
          <ExternalLink size={14} className="mr-1" />
          View Details
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-white mb-4">Are you sure?</h3>
            <p className="text-gray-400 mb-4">Do you really want to delete this wallet? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsConfirmOpen(false)} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white">Cancel</button>
              <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}