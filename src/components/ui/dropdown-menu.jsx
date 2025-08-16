"use client"

import React, { useState, useRef, useEffect } from "react"

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, setIsOpen }))}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => {
  return <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
}

const DropdownMenuContent = ({ children, isOpen, align = "start" }) => {
  if (!isOpen) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      className={`absolute z-50 min-w-32 overflow-hidden rounded-md border bg-white p-1 shadow-md animate-in fade-in-0 zoom-in-95 ${alignmentClasses[align]} mt-1`}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className = "" }) => {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const DropdownMenuSeparator = () => {
  return <div className="-mx-1 my-1 h-px bg-gray-200" />
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }
