import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, XCircle, Building, Loader2 } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

 interface Asset {
  id: string;
  name: string;
  serial: string;
  inventory: string;
  status: 'Active' | 'In Repair' | 'Inactive';
  office: {
    id: string;
    name: string;
  };
}
const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

 // Buscar en backend
useEffect(() => {
  const performSearch = async () => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/assets?search=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Error al buscar');

      const data = await res.json(); 
      setSearchResults(data);        
    } catch (err) {
      setError('No se pudo conectar con el servidor');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const delayDebounce = setTimeout(() => {
    performSearch();
  }, 300); // Debounce

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-white mb-6">
        Global <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Asset Search</span>
      </h1>

      {/* Barra de búsqueda */}
      <div className="relative w-full max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        <input
          type="text"
          placeholder="Search by name, serial, inventory, status, or office..."
          className="w-full pl-14 pr-12 py-4 bg-gray-800/70 border border-gray-700 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Resultados */}
      <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700 overflow-x-auto">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-400">
            🛑 {error}
          </div>
        )}

        {!loading && !error && searchTerm.length > 0 && searchResults.length === 0 && (
          <motion.div
            className="text-center py-10 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No assets found matching your search criteria.
          </motion.div>
        )}

        {!loading && searchResults.length > 0 && (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Serial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Office</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {searchResults.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{asset?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{asset?.serial}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{asset?.inventory}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          asset.status === 'Active'
                            ? 'bg-green-600/20 text-green-400'
                            : asset.status === 'In Repair'
                            ? 'bg-yellow-600/20 text-yellow-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {asset?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex items-center">
                      <Building className="w-4 h-4 mr-2 text-blue-400" />
                      {asset.office?.name}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalSearch;