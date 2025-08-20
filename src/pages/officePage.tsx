import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, XCircle, Loader2, Building, Replace } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

interface Asset {
  id: string;
  name: string;
  serial: string;
  inventory: string;
  status: 'Active' | 'In Repair' | 'Inactive';
  officeId: string;
}
interface Office {
  id: string;
  name: string;
}
interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  assetName: string;
}

interface AssetModalProps {
  onClose: () => void;
  onSave: (asset: Partial<Asset>) => void; // ✅ Acepta objetos incompletos
  asset: Asset | null;
}
interface MoveAssetModalProps {
  onClose: () => void;
  onMove: (newOfficeId: string) => void;
  assetName: string;
  currentOfficeName: string;
  offices: { id: string; name: string }[];
}
const OfficePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [officeName, setOfficeName] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
const [isMoveModalOpen, setIsMoveModalOpen] = useState<boolean>(false);
const [currentMoveAsset, setCurrentMoveAsset] = useState<{ id: string; name: string } | null>(null);
const [currentOfficeName, setCurrentOfficeName] = useState<string>('');
const [allOffices, setAllOffices] = useState<{ id: string; name: string }[]>([]);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  // Cargar nombre de oficina y activos (con búsqueda)
  useEffect(() => {
    
    const fetchAssets = async () => {
      // Cargar todas las oficinas
const officesRes = await fetch(`${API_URL}/api/offices`);
if (!officesRes.ok) throw new Error('Error al cargar oficinas');
const officesData: Office[] = await officesRes.json();
setAllOffices(officesData);
      setLoading(true);
      setError(null);
      try {
        // Obtener nombre de oficina
        if (id) {
          const officeRes = await fetch(`${API_URL}/api/offices/${id}`);
          if (!officeRes.ok) throw new Error('Oficina no encontrada');
          const officeData = await officeRes.json();
          setOfficeName(officeData.name);
setCurrentOfficeName(officeData.name);
        }

        // Construir URL con búsqueda
        let url = `${API_URL}/api/assets/office/${id}`;
        if (searchTerm) {
          url += `/search?q=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Error al cargar activos');
        const data: Asset[] = await res.json();
        setAssets(data);
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssets();
  }, [id, searchTerm]);

  // Crear o editar activo
const handleAddEditAsset = async (assetData: Partial<Asset>) => { 
    try {
      const payload = { ...assetData, officeId: id };

      if (currentAsset?.id) {
        // Editar
        const res = await fetch(`${API_URL}/api/assets/${currentAsset.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al actualizar');
      } else {
        // Crear
        const res = await fetch(`${API_URL}/api/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al crear');
      }

      // Refrescar lista
      const res = await fetch(`${API_URL}/api/assets/office/${id}`);
      const data: Asset[] = await res.json();
      setAssets(data);
      setIsModalOpen(false);
      setCurrentAsset(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
      console.error('Save error', err);
    }
  };

  // Eliminar activo
 const handleDeleteAsset = async (asset: Asset) => {
  setAssetToDelete(asset);
  setIsDeleteModalOpen(true);
};

const confirmDelete = async () => {
  if (!assetToDelete) return;

  try {
    const res = await fetch(`${API_URL}/api/assets/${assetToDelete.id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al eliminar');
    }

    // Actualizar lista local
    setAssets(assets.filter((a) => a.id !== assetToDelete.id));
    closeDeleteModal();
  } catch (err: any) {
    alert(`Error al eliminar: ${err.message}`);
    console.error('Delete error', err);
    closeDeleteModal();
  }
};

const closeDeleteModal = () => {
  setIsDeleteModalOpen(false);
  setAssetToDelete(null);
};

  const handleMoveAsset = async (newOfficeId: string) => {
  if (!currentMoveAsset) return;

  try {
    const res = await fetch(`${API_URL}/api/assets/${currentMoveAsset.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officeId: newOfficeId }),
    });

    if (!res.ok) throw new Error('Error al mover el activo');

    // Refrescar lista
    const refreshRes = await fetch(`${API_URL}/api/assets/office/${id}`);
    const data: Asset[] = await refreshRes.json();
    setAssets(data);

    setIsMoveModalOpen(false);
    setCurrentMoveAsset(null);
  } catch (err: any) {
    alert(`Error al mover: ${err.message}`);
    console.error('Move error', err);
  }
};
  const openEditModal = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentAsset(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-white mb-6">
        <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          {officeName || 'Loading...'}
        </span>{' '}
        Assets
      </h1>

      {/* Barra de búsqueda y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
        <motion.button
          onClick={openAddModal}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Asset
        </motion.button>
      </div>

      {/* Tabla de activos */}
      <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">
            🛑 {error}
          </div>
        ) : assets.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Serial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {assets.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{asset.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{asset.serial}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{asset.inventory}</td>
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
                        {asset.status}
                      </span>
                    </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <motion.button
    onClick={() => {
      setCurrentMoveAsset({ id: asset.id, name: asset.name });
      setIsMoveModalOpen(true);
    }}
    className="text-yellow-400 hover:text-yellow-300 mr-4"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    title="Move to another office"
  >
    <Replace className="w-5 h-5" />
  </motion.button>

  <motion.button
    onClick={() => openEditModal(asset)}
    className="text-blue-400 hover:text-blue-300 mr-4"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    title="Edit"
  >
    <Edit className="w-5 h-5" />
  </motion.button>

 <motion.button
  onClick={() => handleDeleteAsset(asset)}
  className="text-red-400 hover:text-red-300"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  title="Delete"
>
  <Trash2 className="w-5 h-5" />
</motion.button>
</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          <motion.div
            className="text-center py-10 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No assets found for this office. Time to get some!
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
        <AssetModal
  onClose={() => setIsModalOpen(false)}
  onSave={handleAddEditAsset}
  asset={currentAsset}
/>
        )}
      </AnimatePresence>
      {/* Modal de mover */}
<AnimatePresence>
  {isMoveModalOpen && currentMoveAsset && (
    <MoveAssetModal
      onClose={() => {
        setIsMoveModalOpen(false);
        setCurrentMoveAsset(null);
      }}
      onMove={handleMoveAsset}
      assetName={currentMoveAsset.name}
      currentOfficeName={currentOfficeName}
      offices={allOffices}
    />
  )}
</AnimatePresence>
{/* Modal de confirmación de eliminación */}
<AnimatePresence>
  {isDeleteModalOpen && assetToDelete && (
    <ConfirmDeleteModal
      onConfirm={confirmDelete}
      onCancel={closeDeleteModal}
      assetName={assetToDelete.name}
    />
  )}
</AnimatePresence>
    </motion.div>
  );
};

// --- Modal de edición/creación ---
const AssetModal: React.FC<AssetModalProps> = ({ onClose, onSave, asset }) => {
  const [name, setName] = useState<string>(asset?.name || '');
  const [serial, setSerial] = useState<string>(asset?.serial || '');
  const [inventory, setInventory] = useState<string>(asset?.inventory || '');
  const [status, setStatus] = useState<Asset['status']>(asset?.status || 'Active');

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ Solo incluye `id` si existe (es una edición)
  const assetData = {
    name,
    serial,
    inventory,
    status,
    officeId: asset?.officeId || '', // se mantiene
    ...(asset?.id && { id: asset.id }), // ✅ Solo si es edición
  };

  onSave(assetData);
};

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          {asset ? 'Edit Asset' : 'Add New Asset'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
              Asset Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="serial" className="block text-gray-300 text-sm font-medium mb-2">
              Serial Number
            </label>
            <input
              type="text"
              id="serial"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="inventory" className="block text-gray-300 text-sm font-medium mb-2">
              Inventory Number
            </label>
            <input
              type="text"
              id="inventory"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-300 text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Asset['status'])}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="Active">Active</option>
              <option value="In Repair">In Repair</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {asset ? 'Save Changes' : 'Add Asset'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
  assetName,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="flex items-center mb-6">
          <XCircle className="w-10 h-10 text-red-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Confirm Deletion</h2>
        </div>
        <p className="text-gray-300 mb-8">
          Are you sure you want to delete the asset <strong>"{assetName}"</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <motion.button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete Asset
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
const MoveAssetModal: React.FC<MoveAssetModalProps> = ({
  onClose,
  onMove,
  assetName,
  currentOfficeName,
  offices,
}) => {
  const [newOfficeId, setNewOfficeId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficeId || newOfficeId === '') return;
    onMove(newOfficeId);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Move Asset</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="text-gray-300 mb-2">
              Move <strong>"{assetName}"</strong> from <strong>{currentOfficeName}</strong> to:
            </p>
            <select
              value={newOfficeId}
              onChange={(e) => setNewOfficeId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 mt-2"
              required
            >
              <option value="">Select new office...</option>
              {offices
                .filter((office) => office.name !== currentOfficeName)
                .map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Move Asset
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
export default OfficePage;