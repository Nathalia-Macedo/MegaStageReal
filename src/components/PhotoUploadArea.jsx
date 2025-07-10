import { useRef } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ImagePlus, Loader2 } from "lucide-react";

const PhotoUploadArea = ({ talentId, uploadingPhotos, onPhotoSelection, onPhotoDrop }) => {
  const photoInputRef = useRef(null);

  const handleAddPhotos = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const handlePhotoDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropArea = document.getElementById("photo-drop-area");
    if (dropArea) dropArea.classList.add("bg-pink-900/30", "border-pink-500/50");
  };

  const handlePhotoDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropArea = document.getElementById("photo-drop-area");
    if (dropArea) dropArea.classList.remove("bg-pink-900/30", "border-pink-500/50");
  };

  return (
    <div
      id="photo-drop-area"
      className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md transition-colors duration-200"
      onDragOver={handlePhotoDragOver}
      onDragLeave={handlePhotoDragLeave}
      onDrop={onPhotoDrop}
    >
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-700">
        <h4 className="text-base uppercase tracking-wider text-pink-400 font-medium">
          <span className="mr-2">📷</span> Fotos do Talento
        </h4>
        <motion.button
          type="button"
          onClick={handleAddPhotos}
          disabled={uploadingPhotos}
          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-800/40 transition-colors ${
            uploadingPhotos ? "opacity-70 cursor-not-allowed" : ""
          }`}
          whileHover={!uploadingPhotos ? { scale: 1.05 } : {}}
          whileTap={!uploadingPhotos ? { scale: 0.95 } : {}}
        >
          {uploadingPhotos ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4 mr-1" />
              Adicionar Fotos
            </>
          )}
          <input
            type="file"
            ref={photoInputRef}
            onChange={onPhotoSelection}
            accept="image/*"
            multiple
            className="hidden"
          />
        </motion.button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Arraste e solte imagens aqui ou clique em "Adicionar Fotos". Suporta JPEG, PNG, GIF e WebP.</p>
    </div>
  );
};

export default PhotoUploadArea;