
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import GalleryPicker from './components/GalleryPicker';
import ResultsGrid from './components/ResultsGrid';
import { ImageFile, MatchResult, ScanningStatus } from './types';
import { compareImages } from './services/geminiService';

const App: React.FC = () => {
  const [targetImage, setTargetImage] = useState<ImageFile | null>(null);
  const [localLibrary, setLocalLibrary] = useState<ImageFile[]>([]);
  const [matches, setMatches] = useState<(MatchResult & { url: string; name: string })[]>([]);
  const [status, setStatus] = useState<ScanningStatus>({
    total: 0,
    processed: 0,
    isScanning: false
  });
  const [error, setError] = useState<string | null>(null);

  const handleTargetUpload = (file: ImageFile) => {
    setTargetImage(file);
    setMatches([]);
    setError(null);
  };

  const handleLibraryUpload = (files: ImageFile[]) => {
    setLocalLibrary(files);
    setMatches([]);
    setError(null);
  };

  const startScanning = async () => {
    if (!targetImage || localLibrary.length === 0) return;

    setStatus({ total: localLibrary.length, processed: 0, isScanning: true });
    setMatches([]);
    setError(null);

    const batchSize = 5;
    const allMatches: (MatchResult & { url: string; name: string })[] = [];

    try {
      for (let i = 0; i < localLibrary.length; i += batchSize) {
        const batch = localLibrary.slice(i, i + batchSize);
        const results = await compareImages(targetImage.data, batch);
        
        results.forEach(res => {
          const original = localLibrary.find(img => img.id === res.id);
          if (original) {
            allMatches.push({
              ...res,
              url: original.url,
              name: original.name
            });
          }
        });

        setStatus(prev => ({ 
          ...prev, 
          processed: Math.min(prev.total, i + batchSize) 
        }));
      }

      setMatches(allMatches.sort((a, b) => b.similarityScore - a.similarityScore));
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro durante a varredura.");
    } finally {
      setStatus(prev => ({ ...prev, isScanning: false }));
    }
  };

  const resetAll = () => {
    setTargetImage(null);
    setLocalLibrary([]);
    setMatches([]);
    setStatus({ total: 0, processed: 0, isScanning: false });
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
      <Header />

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-8">
          <section className="glass-effect rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-bullseye text-indigo-400"></i>
              Imagem de Referência
            </h2>
            <UploadZone onUpload={handleTargetUpload} currentImage={targetImage} />
          </section>

          <section className="glass-effect rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-folder-open text-amber-400"></i>
              Pastas Locais / Galeria do Dispositivo
            </h2>
            <GalleryPicker onFilesAdded={handleLibraryUpload} count={localLibrary.length} />
            
            {localLibrary.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-400">{localLibrary.length} imagens indexadas</span>
                <button 
                  onClick={() => setLocalLibrary([])}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Limpar Biblioteca
                </button>
              </div>
            )}
          </section>

          <div className="sticky bottom-8 z-10">
            <button
              disabled={!targetImage || localLibrary.length === 0 || status.isScanning}
              onClick={startScanning}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3
                ${(!targetImage || localLibrary.length === 0 || status.isScanning) 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white hover:shadow-indigo-500/25'}`}
            >
              {status.isScanning ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Escaneando... {Math.round((status.processed / status.total) * 100)}%
                </>
              ) : (
                <>
                  <i className="fas fa-search-plus"></i>
                  Iniciar Varredura Neural
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section className="glass-effect rounded-3xl p-6 shadow-2xl min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <i className="fas fa-magic text-purple-400"></i>
                Resultados Encontrados
              </h2>
              {matches.length > 0 && (
                <span className="bg-indigo-900/50 text-indigo-200 px-3 py-1 rounded-full text-xs font-mono">
                  {matches.length} Correspondências
                </span>
              )}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            {!status.isScanning && matches.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
                <i className="fas fa-images text-5xl mb-4 opacity-20"></i>
                <p>Nenhum resultado para exibir ainda.</p>
                <p className="text-sm">Suba uma imagem alvo e indexe pastas para começar.</p>
              </div>
            )}

            {status.isScanning && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-48 h-48 rounded-xl overflow-hidden mb-6 border border-indigo-500/30 shadow-2xl">
                   <img src={targetImage?.url} className="w-full h-full object-cover opacity-40 grayscale" alt="Escaneando" />
                   <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_indigo] scan-line"></div>
                </div>
                <p className="text-indigo-300 font-mono animate-pulse">Analisando padrões visuais...</p>
                <div className="w-full max-w-xs bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                   <div 
                    className="bg-indigo-500 h-full transition-all duration-300" 
                    style={{ width: `${(status.processed / status.total) * 100}%` }}
                   ></div>
                </div>
              </div>
            )}

            <ResultsGrid matches={matches} />
          </section>
        </div>
      </main>

      <button 
        onClick={resetAll}
        className="fixed bottom-8 left-8 p-4 bg-slate-900/80 border border-slate-700 text-slate-400 rounded-full hover:bg-slate-800 transition-colors shadow-lg"
        title="Reiniciar Aplicativo"
      >
        <i className="fas fa-sync-alt"></i>
      </button>
    </div>
  );
};

export default App;
