import { useState } from "react";
import { FiFolder, FiPlus, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

interface Folder {
  id: string;
  name: string;
  bookCount: number;
}

export const FolderDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSaveToFolder: (folderId: string) => void;
  currentBookFolders?: string[];
  folders: Folder[];
  onCreateFolder: (folderName: string) => void;
}> = ({
  isOpen,
  onClose,
  onSaveToFolder,
  currentBookFolders = [],
  folders,
  onCreateFolder,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreatingNew(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[70]"
          >
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm">
                Save to folder
              </h3>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {folders.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FiFolder className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No folders yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Create your first folder below
                  </p>
                </div>
              ) : (
                folders.map((folder) => {
                  const isSaved = currentBookFolders.includes(folder.id);
                  return (
                    <div
                      key={folder.id}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <FiFolder className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 text-sm">
                            {folder.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {folder.bookCount} books
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onSaveToFolder(folder.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSaved
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {isSaved ? (
                          <span className="flex items-center space-x-1">
                            <FiCheck className="w-3 h-3" />
                            <span>Saved</span>
                          </span>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-200 p-3">
              {isCreatingNew ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFolder();
                      if (e.key === "Escape") {
                        setIsCreatingNew(false);
                        setNewFolderName("");
                      }
                    }}
                    placeholder="Folder name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingNew(false);
                      setNewFolderName("");
                    }}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <FiPlus className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600">
                    Create new folder
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
