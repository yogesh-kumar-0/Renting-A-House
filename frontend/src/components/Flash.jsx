import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Flash = () => {
  const { flash, clearFlash } = useAuth();

  useEffect(() => {
    if (flash.success || flash.error) {
      const timer = setTimeout(clearFlash, 3500);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  if (!flash.success && !flash.error) return null;

  return (
    <div className="fixed top-[76px] left-1/2 -translate-x-1/2 z-999 flex flex-col gap-2 min-w-[300px] max-w-[420px] w-[90%]">
      {flash.success && (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-white border border-green-300 rounded-2xl shadow-lg">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-circle-check text-green-500 text-sm"></i>
          </div>
          <span className="text-sm text-green-900 font-medium flex-1">{flash.success}</span>
          <button onClick={clearFlash} className="bg-transparent border-0 cursor-pointer text-gray-400 text-base p-0 leading-tight flex-shrink-0">×</button>
        </div>
      )}
      {flash.error && (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-white border border-red-200 rounded-2xl shadow-lg">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
          </div>
          <span className="text-sm text-red-900 font-medium flex-1">{flash.error}</span>
          <button onClick={clearFlash} className="bg-transparent border-0 cursor-pointer text-gray-400 text-base p-0 leading-tight flex-shrink-0">×</button>
        </div>
      )}
    </div>
  );
};