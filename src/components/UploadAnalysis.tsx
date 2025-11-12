import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X, FileImage, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";

interface UploadAnalysisProps {
  onUploadComplete?: (file: File, analysisType: string) => void;
}

export function UploadAnalysis({ onUploadComplete }: UploadAnalysisProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<string>("radiografia");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisTypes = [
    { value: "radiografia", label: "Radiografía" },
    { value: "tomografia", label: "Tomografía (CT)" },
    { value: "resonancia", label: "Resonancia Magnética (MRI)" },
    { value: "ecografia", label: "Ecografía" },
    { value: "mamografia", label: "Mamografía" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 10MB');
        return;
      }

      setSelectedFile(file);
      setUploadSuccess(false);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadSuccess(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    // Simular subida y análisis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Aquí se conectará con tu API Gateway
    // const formData = new FormData();
    // formData.append('image', selectedFile);
    // formData.append('analysisType', analysisType);
    // 
    // try {
    //   const response = await fetch('TU_API_GATEWAY_URL/analysis/upload', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     onUploadComplete?.(selectedFile, analysisType);
    //   }
    // } catch (error) {
    //   console.error('Error al subir:', error);
    // }
    
    console.log('Archivo subido:', selectedFile.name, 'Tipo:', analysisType);
    setUploading(false);
    setUploadSuccess(true);
    onUploadComplete?.(selectedFile, analysisType);
    
    // Limpiar después de 2 segundos
    setTimeout(() => {
      handleRemoveFile();
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl shadow-blue-500/30">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl text-white mb-2 flex items-center gap-2">
            <Upload className="w-7 h-7" />
            Nuevo Análisis Médico
          </h2>
          <p className="text-blue-100">
            Sube una imagen médica para análisis con IA
          </p>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 mb-2">
                Arrastra y suelta tu imagen aquí
              </p>
              <p className="text-sm text-gray-500 mb-4">
                o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-400">
                Formatos: JPG, PNG, DICOM • Máximo 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-gray-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {uploadSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm">Análisis iniciado correctamente</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Analysis Type Selector */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Tipo de análisis
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={uploading}
                >
                  {analysisTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Button */}
      {selectedFile && !uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PrimaryButton
            onClick={handleUpload}
            disabled={uploading}
            loading={uploading}
            className="bg-white text-blue-600 hover:bg-gray-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analizando imagen...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Iniciar Análisis
              </>
            )}
          </PrimaryButton>
        </motion.div>
      )}

      {/* Info */}
      <div className="mt-6 flex items-start gap-3 bg-blue-500/20 backdrop-blur-sm rounded-lg p-4">
        <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-50">
          El análisis puede tomar entre 2-5 minutos. Recibirás una notificación cuando esté listo.
        </p>
      </div>
    </div>
  );
}
