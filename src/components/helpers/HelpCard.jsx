import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from 'lucide-react'

const HelpCard = ({ card, isActive, onClick }) => {
  return (
    <motion.div
      className={`border rounded-lg overflow-hidden ${card.color} cursor-pointer transition-all`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`rounded-full p-2 mr-3 ${card.iconColor} bg-white bg-opacity-50`}>
            {card.icon}
          </div>
          <h4 className="font-medium text-gray-800">{card.title}</h4>
        </div>
        <motion.div
          animate={{ rotate: isActive ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            <div className="p-4">
              <p className="text-gray-700 mb-3">{card.description}</p>
              <div className="bg-white bg-opacity-70 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 flex items-start">
                  <span className="text-pink-500 font-bold mr-2 text-lg leading-none">💡</span>
                  <span>{card.tip}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default HelpCard