"use client"

import { useState } from "react"
import { User, Edit, Star, Bell, MoreVertical } from "lucide-react"
import { useNotifications } from "../contexts/notifications-context"

export default function NotificationItem({ notification }) {
  const { markAsRead, getNotificationIcon } = useNotifications()
  const [showOptions, setShowOptions] = useState(false)

  const getIcon = () => {
    const iconType = getNotificationIcon(notification.action)

    switch (iconType) {
      case "user":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-500" />
          </div>
        )
      case "edit":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Edit className="h-5 w-5 text-green-500" />
          </div>
        )
      case "star":
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Bell className="h-5 w-5 text-gray-500" />
          </div>
        )
    }
  }

  const handleMarkAsRead = (e) => {
    e.stopPropagation()
    markAsRead(notification.id)
    setShowOptions(false)
  }

  return (
    <div className="px-4 py-3 hover:bg-gray-100 transition-colors duration-200 flex items-start">
      <div className="mr-3 flex-shrink-0">{getIcon()}</div>
      <div className="flex-grow">
        <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
      </div>
      <div className="ml-2 flex-shrink-0 relative">
        {!notification.read && <div className="w-3 h-3 rounded-full bg-pink-500"></div>}
        <button onClick={() => setShowOptions(!showOptions)} className="ml-2 text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-4 w-4" />
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <button
              onClick={handleMarkAsRead}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Marcar como lida
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
