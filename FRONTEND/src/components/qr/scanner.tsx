"use client";

import { useState, useRef, useEffect } from "react";
import { X, QrCode, Camera, Send, History } from "lucide-react";

// Declarar el tipo para QrScanner
declare global {
  interface Window {
    QrScanner: any;
  }
}

interface Product {
  id: number;
  sku: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  valor: number;
  moneda: string;
  stock: number | null;
  imagen: Array<{
    ruta: string;
    principal: boolean;
  }>;
}

interface ScannedProduct extends Product {
  cantidad: number;
}

interface QRScannerProps {
  data: Product[];
  onScanComplete?: (scannedProducts: ScannedProduct[]) => void;
}

export default function QRScanner({ data, onScanComplete }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
  const [lastScanned, setLastScanned] = useState<ScannedProduct | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [error, setError] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && !isManualMode) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, isManualMode]);

  useEffect(() => {
    if (isManualMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isManualMode]);

  const findProductByCode = (code: string): Product | null => {
    return (
      data.find((product) => product.codigo === code || product.sku === code) ||
      null
    );
  };

  const addScannedProduct = (product: Product) => {
    setScannedProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p.codigo === product.codigo);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].cantidad += 1;
        setLastScanned(updated[existingIndex]);
        return updated;
      } else {
        const newScanned = { ...product, cantidad: 1 };
        setLastScanned(newScanned);
        return [...prev, newScanned];
      }
    });
    setError("");
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;

    const product = findProductByCode(manualCode.trim());
    if (product) {
      addScannedProduct(product);
      setManualCode("");
      setIsManualMode(false);
    } else {
      setError("Código no encontrado en la base de datos");
    }
  };

  const handleScanCode = (code: string) => {
    const product = findProductByCode(code);
    if (product) {
      addScannedProduct(product);
    } else {
      setError("Código no encontrado en la base de datos");
    }
  };

  const handleClose = () => {
    stopCamera();
    if (scannedProducts.length > 0) {
      setShowConfirmExit(true);
    } else {
      setIsOpen(false);
      resetScanner();
    }
  };

  const confirmExit = () => {
    setIsOpen(false);
    setShowConfirmExit(false);
    resetScanner();
  };

  const resetScanner = () => {
    setScannedProducts([]);
    setLastScanned(null);
    setIsManualMode(false);
    setManualCode("");
    setShowHistory(false);
    setError("");
    setCameraError("");
  };

  const handleSendResults = () => {
    console.log("Productos escaneados:", scannedProducts);
    if (onScanComplete) {
      onScanComplete(scannedProducts);
    }
    setIsOpen(false);
    resetScanner();
  };

  const getProductImage = (product: Product) => {
    const mainImage = product.imagen.find((img) => img.principal);
    return (
      mainImage?.ruta ||
      product.imagen[0]?.ruta ||
      "/diverse-products-still-life.png"
    );
  };

  const [qrScanner, setQrScanner] = useState<any>(null);

  const startCamera = async () => {
    try {
      setCameraError("");

      // Cargar la librería QrScanner dinámicamente
      if (!window.QrScanner) {
        const QrScannerModule = await import(
          "../../../public/js/qr-scanner.min.js"
        );
        window.QrScanner = QrScannerModule.default;
      }

      if (videoRef.current) {
        // Crear instancia del escáner QR
        const scanner = new window.QrScanner(
          videoRef.current,
          (result: string) => {
            console.log("QR Code detected:", result);
            handleScanCode(result);
            // Opcional: reproducir sonido
            // playBeepSound();
          },
          {
            returnDetailedScanResult: false,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        // Iniciar el escáner
        await scanner.start();
        setQrScanner(scanner);
        setStream(scanner); // Usar el scanner como stream para el cleanup
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  };

  const stopCamera = () => {
    if (qrScanner) {
      qrScanner.stop();
      setQrScanner(null);
    }
    if (stream && typeof stream.stop === "function") {
      stream.stop();
    }
    setStream(null);
    setCameraError("");
  };

  // Función opcional para reproducir sonido
  const playBeepSound = () => {
    const audio = new Audio("/sounds/sonido.mp3");
    audio
      .play()
      .catch((e) => console.log("No se pudo reproducir el sonido:", e));
  };

  const simulateQRScan = () => {
    if (data.length > 0) {
      const randomProduct = data[Math.floor(Math.random() * data.length)];
      handleScanCode(randomProduct.codigo);
    }
  };

  return (
    <>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-core-primary hover:opacity-80 text-white rounded-lg font-medium transition-colors"
      >
        <QrCode className="w-5 h-5" />
        Escanear QR
      </button>

      {/* Modal fullscreen */}
      {isOpen && (
        <div className="fixed inset-0 z-99 bg-red-500">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
            <div></div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Contenido principal */}
          <div className="h-full flex flex-col">
            {/* Área de escáner/input */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-6">
              {isManualMode ? (
                /* Modo manual */
                <div className="w-full max-w-sm space-y-6">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">Ingresar código</h2>
                    <p className="text-gray-300">
                      Ingresa el código del producto manualmente
                    </p>
                  </div>

                  <div className="bg-core-light rounded-lg p-4">
                    <label className="block text-sm font-medium text-core-dark/60 mb-2">
                      CÓDIGO DEL PRODUCTO
                    </label>
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleManualSubmit()
                        }
                        placeholder="Ej. 6797-439543"
                        className="flex-1 px-3 py-2 border border-core-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleManualSubmit}
                        className="w-12 h-12 bg-core-primary hover:opacity-80 rounded-full flex items-center justify-center text-white"
                      >
                        ✓
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Modo escáner */
                <div className="w-full h-full flex flex-col items-center justify-center text-white relative">
                  {stream && !cameraError ? (
                    <div className="w-full h-full relative">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />

                      {/* Overlay con marco de escaneo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                        </div>
                      </div>

                      {/* Instrucciones */}
                      <div className="absolute top-20 left-4 right-4 text-center">
                        <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                          Escanear código QR
                        </h2>
                        <p className="text-white/90 drop-shadow-lg">
                          Centra el código QR dentro del marco
                        </p>
                      </div>

                      {/* Botón de simulación temporal */}
                      <button
                        onClick={simulateQRScan}
                        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-core-primary/80 hover:opacity-80/80 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Simular escaneo (temporal)
                      </button>
                    </div>
                  ) : (
                    /* Fallback cuando no hay cámara */
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                      <div className="text-center space-y-4">
                        <Camera className="w-16 h-16 text-white/50 mx-auto" />
                        <h2 className="text-2xl font-bold">
                          {cameraError
                            ? "Error de cámara"
                            : "Iniciando cámara..."}
                        </h2>
                        <p className="text-gray-300 max-w-xs">
                          {cameraError || "Preparando el escáner QR"}
                        </p>
                        {cameraError && (
                          <button
                            onClick={startCamera}
                            className="bg-core-primary hover:opacity-80 text-white px-4 py-2 rounded-lg"
                          >
                            Reintentar
                          </button>
                        )}
                        {!cameraError && (
                          <button
                            onClick={simulateQRScan}
                            className="bg-core-primary/80 hover:opacity-80/80 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Simular escaneo (temporal)
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="absolute top-20 left-4 right-4 bg-red-500/20 border border-red-500 rounded-lg p-3">
                      <p className="text-red-200 text-sm text-center">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Último producto escaneado */}
            {lastScanned && (
              <div
                className="bg-core-light/10 backdrop-blur-sm border-t border-white/20 p-4 cursor-pointer"
                onClick={() => setShowHistory(true)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getProductImage(lastScanned) || "/placeholder.svg"}
                    alt={lastScanned.nombre}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {lastScanned.nombre}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Cantidad: {lastScanned.cantidad}
                    </p>
                  </div>
                  <History className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            {/* Botones inferiores */}
            <div className="p-4 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsManualMode(false);
                    setError("");
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    !isManualMode
                      ? "bg-core-light text-black"
                      : "bg-core-light/20 text-white border border-white/30"
                  }`}
                >
                  Escanear código
                </button>
                <button
                  onClick={() => {
                    setIsManualMode(true);
                    setError("");
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    isManualMode
                      ? "bg-core-light text-black"
                      : "bg-core-light/20 text-white border border-white/30"
                  }`}
                >
                  Ingresar código
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer del historial */}
      {showHistory && (
        <div className="fixed inset-0 z-60 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-core-light rounded-t-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Productos escaneados</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-8 h-8 rounded-full bg-core-gray/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96 p-4 space-y-3">
              {scannedProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-core-light rounded-lg"
                >
                  <img
                    src={getProductImage(product) || "/placeholder.svg"}
                    alt={product.nombre}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.nombre}</h4>
                    <p className="text-sm text-core-dark/60">SKU: {product.sku}</p>
                    <p className="text-sm text-core-dark/60">
                      Código: {product.codigo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Cant: {product.cantidad}</p>
                    <p className="text-sm text-core-dark/60">
                      {product.valor} {product.moneda}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleSendResults}
                className="w-full bg-core-primary hover:opacity-80 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar resultados ({scannedProducts.length} productos)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de salida */}
      {showConfirmExit && (
        <div className="fixed inset-0 z-70 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-core-light rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">¿Salir del escáner?</h3>
            <p className="text-core-dark/60 mb-4">
              Tienes {scannedProducts.length} productos escaneados. ¿Estás
              seguro de que quieres salir sin enviar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 py-2 px-4 border border-core-gray/50 rounded-lg text-core-dark/80 hover:bg-core-light"
              >
                Cancelar
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
