import { motion } from "framer-motion";
import { ExternalLink, Copy, Download, Trash2, MoreHorizontal , Loader2} from "lucide-react";
import { toast } from "react-toastify";

const PhotoGallery = ({ photos, loadingPhotos, onDeletePhoto, onToggleActionMenu, photoActionMenu }) => {
  if (loadingPhotos) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (photos.length === 0) {
    return <p className="text-gray-500 text-center">Nenhuma foto disponível. Adicione fotos para visualizar.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <motion.div
          key={photo.uniqueKey}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative group"
        >
          <img
            src={photo.image_url || "/placeholder.svg"}
            alt={`Foto do talento ${photo.id}`}
            className="w-full h-48 object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg transition-all duration-300">
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
              <motion.button
                onClick={() => window.open(photo.image_url, "_blank")}
                className="p-2 bg-white/80 rounded-full hover:bg-white text-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={() =>
                  navigator.clipboard
                    .writeText(photo.image_url)
                    .then(() => toast.success("URL da foto copiada!"))
                    .catch(() => toast.error("Erro ao copiar URL"))
                }
                className="p-2 bg-white/80 rounded-full hover:bg-white text-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Copy className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = photo.image_url;
                  link.download = `talento-foto-${photo.id}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-2 bg-white/80 rounded-full hover:bg-white text-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={() => onDeletePhoto(photo.id)}
                className="p-2 bg-white/80 rounded-full hover:bg-red-500 text-gray-800 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
              <motion.div
                className="absolute right-2 top-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: photoActionMenu === photo.id ? 1 : 0 }}
              >
                <button
                  onClick={() => onToggleActionMenu(photo.id)}
                  className="p-1 bg-gray-800 rounded-full text-gray-300 hover:text-white"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PhotoGallery;