'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export default function ModalWrapper({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  className = ''
}: ModalWrapperProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    'full': 'max-w-[90vw]'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div 
        className={`relative bg-bg-secondary border border-border-secondary rounded-lg shadow-2xl w-full ${sizeClasses[size]} max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border-secondary">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-primary transition-colors group"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}