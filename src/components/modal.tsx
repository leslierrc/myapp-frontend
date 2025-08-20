import { motion } from "framer-motion";
import { useState } from "react";

// --- Modal para mover activo ---
interface MoveAssetModalProps {
  onClose: () => void;
  onMove: (newOfficeId: string) => void;
  assetName: string;
  currentOfficeName: string;
  offices: { id: string; name: string }[];
}

export const MoveAssetModal: React.FC<MoveAssetModalProps> = ({
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