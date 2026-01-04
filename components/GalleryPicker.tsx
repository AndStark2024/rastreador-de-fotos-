
import React from 'react';
import { ImageFile } from '../types';

interface GalleryPickerProps {
  onFilesAdded: (files: ImageFile[]) => void;
  count: number;
}

const GalleryPicker: React.FC<GalleryPickerProps> = ({ onFilesAdded, count }) => {
  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    const processedFiles: ImageFile[] = await Promise.all(
      imageFiles.slice(0, 100).map(async (f) => {
        return new Promise<ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              id: crypto.randomUUID(),
              name: f.name,
              url: URL.createObjectURL(f),
              data: event.target?.result as string,
              lastModified: f.lastModified
            });
          };
          reader.readAsDataURL(f);
        });
      })
    );

    onFilesAdded(processedFiles);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <label className="flex flex-col items-center justify-center p-6 border border-slate-700 bg-slate-800/30 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all hover:border-amber-500/50 group">
        <input 
          type="file" 
          className="hidden" 
          multiple
          onChange={handleFolderSelect} 
        />
        <i className="fas fa-images text-2xl text-slate-500 mb-2 group-hover:text-amber-400"></i>
        <span className="text-xs font-semibold text-slate-300 text-center">Selecionar Fotos</span>
      </label>

      <label className="flex flex-col items-center justify-center p-6 border border-slate-700 bg-slate-800/30 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all hover:border-amber-500/50 group">
        <input 
          type="file" 
          className="hidden" 
          {...({ webkitdirectory: "true" } as any)}
          onChange={handleFolderSelect} 
        />
        <i className="fas fa-folder-plus text-2xl text-slate-500 mb-2 group-hover:text-amber-400"></i>
        <span className="text-xs font-semibold text-slate-300 text-center">Importar Pasta</span>
      </label>
      
      <p className="col-span-2 text-[10px] text-slate-500 mt-2 italic">
        Nota: Em navegadores, você deve selecionar arquivos ou pastas manualmente por questões de privacidade.
      </p>
    </div>
  );
};

export default GalleryPicker;
