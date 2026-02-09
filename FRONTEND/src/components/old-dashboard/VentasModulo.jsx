import React, { useState } from "react";

const VentasModulo = ({ data }) => {
  const [activeTab, setActiveTab] = useState("facturacion");

  // Calculate percentages for progress bars
  const calculatePercentage = (valor, meta) => {
    if (!valor || !meta) return 0;
    return Math.min(Math.round((valor / meta) * 100), 100);
  };

  const percentages = {
    facturacion: calculatePercentage(
      data?.facturacion?.valor,
      data?.facturacion?.meta
    ),
    servicios: calculatePercentage(
      data?.servicios?.valor,
      data?.servicios?.meta
    ),
    compras: calculatePercentage(
      data?.compras?.valor,
      data?.compras?.presupuesto
    ),
  };

  return (
    <div className="p-2">
      <div className="p-2 bg-core-light ">
        <nav
          className="flex gap-1 relative after:absolute after:bottom-0 after:inset-x-0 after:border-b-2 after:border-core-gray/30 "
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          {/* Facturación Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("facturacion")}
            className={`px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:opacity-80 hover:bg-core-gray/10 text-sm rounded-lg focus:outline-hidden focus:bg-core-gray/10 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 ${
              activeTab === "facturacion"
                ? "text-stone-800 after:bg-stone-800"
                : "text-core-dark/60 hover:text-stone-800"
            }`}
            aria-selected={activeTab === "facturacion"}
            role="tab"
          >
            Facturación
          </button>

          {/* Servicios Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("servicios")}
            className={`px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:opacity-80 hover:bg-core-gray/10 text-sm rounded-lg focus:outline-hidden focus:bg-core-gray/10 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 ${
              activeTab === "servicios"
                ? "text-stone-800 after:bg-stone-800  "
                : "text-core-dark/60 hover:text-stone-800  "
            }`}
            aria-selected={activeTab === "servicios"}
            role="tab"
          >
            Servicios
          </button>

          {/* Compras Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("compras")}
            className={`px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:opacity-80 hover:bg-core-gray/10 text-sm rounded-lg focus:outline-hidden focus:bg-core-gray/10 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 ${
              activeTab === "compras"
                ? "text-stone-800 after:bg-stone-800  "
                : "text-core-dark/60 hover:text-stone-800  "
            }`}
            aria-selected={activeTab === "compras"}
            role="tab"
          >
            Compras
          </button>
        </nav>

        <div>
          {/* Facturación Content */}
          <div className={activeTab === "facturacion" ? "" : "hidden"}>
            <div className="py-4">
              <h4 className="font-semibold text-xl md:text-2xl text-stone-800">
                {data?.facturacion?.valor?.toLocaleString() || "0"}
              </h4>

              <div className="relative mt-3">
                <div
                  className="flex w-full h-2 bg-core-gray/30 rounded-sm overflow-hidden "
                  role="progressbar"
                  aria-valuenow={percentages.facturacion}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="flex flex-col justify-center rounded-sm overflow-hidden bg-green-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
                    style={{ width: `${percentages.facturacion}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 w-2 h-5 bg-green-600 border-2 border-white rounded-sm transform -translate-y-1/2 "
                  style={{ left: `${percentages.facturacion}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-stone-800 ">0</span>
                <span className="text-xs text-stone-800 ">
                  {data?.facturacion?.meta?.toLocaleString() || "0"}
                </span>
              </div>

              <p className="mt-4 text-sm text-core-dark/80 ">
                Resumen de facturación del período actual
              </p>
            </div>
          </div>

          {/* Servicios Content */}
          <div className={activeTab === "servicios" ? "" : "hidden"}>
            <div className="py-4">
              <h4 className="font-semibold text-xl md:text-2xl text-stone-800 ">
                ${data?.servicios?.valor?.toLocaleString() || "0"}
              </h4>

              <div className="relative mt-3">
                <div
                  className="flex w-full h-2 bg-core-gray/30 rounded-sm overflow-hidden "
                  role="progressbar"
                  aria-valuenow={percentages.servicios}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="flex flex-col justify-center rounded-sm overflow-hidden bg-green-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
                    style={{ width: `${percentages.servicios}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 w-2 h-5 bg-green-600 border-2 border-white rounded-sm transform -translate-y-1/2"
                  style={{ left: `${percentages.servicios}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-stone-800 ">0</span>
                <span className="text-xs text-stone-800 ">
                  ${data?.servicios?.meta?.toLocaleString() || "0"}
                </span>
              </div>

              <p className="mt-4 text-sm text-core-dark/80 ">
                Resumen de servicios prestados
              </p>
            </div>
          </div>

          {/* Compras Content */}
          <div className={activeTab === "compras" ? "" : "hidden"}>
            <div className="py-4">
              <h4 className="font-semibold text-xl md:text-2xl text-stone-800 ">
                ${data?.compras?.valor?.toLocaleString() || "0"}
              </h4>

              <div className="relative mt-3">
                <div
                  className="flex w-full h-2 bg-core-gray/30 rounded-sm overflow-hidden "
                  role="progressbar"
                  aria-valuenow={percentages.compras}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="flex flex-col justify-center rounded-sm overflow-hidden bg-green-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
                    style={{ width: `${percentages.compras}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 w-2 h-5 bg-green-600 border-2 border-white rounded-sm transform -translate-y-1/2 "
                  style={{ left: `${percentages.compras}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-stone-800 ">0</span>
                <span className="text-xs text-stone-800 ">
                  ${data?.compras?.presupuesto?.toLocaleString() || "0"}
                </span>
              </div>

              <p className="mt-4 text-sm text-core-dark/80 ">
                Resumen de compras y presupuesto
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default props
VentasModulo.defaultProps = {
  data: {
    facturacion: {
      valor: 125090,
      meta: 200000,
    },
    servicios: {
      valor: 993758.2,
      meta: 2000000,
    },
    compras: {
      valor: 75000,
      presupuesto: 100000,
    },
  },
};

export default VentasModulo;
