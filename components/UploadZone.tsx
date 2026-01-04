
import React, { useCallback } from 'react';
import { ImageFile } from '../types';

interface UploadZoneProps {
  onUpload: (file: ImageFile) => void;
  currentImage: ImageFile | null;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, currentImage }) => {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpload({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        data: base64,
        lastModified: file.lastModified
      });
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  return (
    <div className="relative group">
      <label className={`
        flex flex-col items-center justify-center w-full min-h-[220px] rounded-2xl cursor-pointer
        transition-all duration-300 border-2 border-dashed
        ${currentImage 
          ? 'border-indigo-500/50 bg-indigo-500/5 overflow-hidden' 
          : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/20 hover:bg-indigo-500/5'}
      `}>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        
        {currentImage ? (
          <div className="relative w-full h-full p-2">
            <img 
              src={currentImage.url} 
              alt="Alvo" 
              className="w-full h-48 object-contain rounded-xl"
            />
            <div className="mt-2 text-center">
              <span className="text-xs text-slate-400 font-mono truncate block px-4">
                {currentImage.name}
              </span>
              <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-tighter">
                Clique para Substituir
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
              <i className="fas fa-cloud-upload-alt text-2xl"></i>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300">Solte a Imagem Alvo Aqui</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG ou WEBP até 10MB</p>
            </div>
          </div>
        )}
      </label>
    </div>
  );
};

export default UploadZone;
