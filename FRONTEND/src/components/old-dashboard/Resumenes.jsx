import React from "react";

const Resumenes = () => {
  return (
    <div className="mb-2 xl:mb-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 xl:gap-5">
      {/* Card */}
      <div className="flex flex-col p-5 bg-core-light border border-core-gray/30 shadow-xs rounded-xl ">
        <div className="space-y-4">
          <h2 className="text-xs uppercase text-core-gray ">Facturación</h2>
          <div className="grid grid-cols-2 gap-x-2">
            <div className="text-2xl font-semibold text-core-dark ">
              $1.217.482
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs bg-green-100 text-green-800 rounded-md ">
              <svg
                className="shrink-0 size-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              37.3%
            </span>
            <p className="text-xs text-core-gray ">antes $1.212.142</p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-col p-5 bg-core-light border border-core-gray/30 shadow-xs rounded-xl ">
        <div className="space-y-4">
          <h2 className="text-xs uppercase text-core-gray ">
            Boletas Honorarios
          </h2>
          <div className="grid grid-cols-2 gap-x-2">
            <div className="text-2xl font-semibold text-core-dark ">
              $246.000
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs bg-green-100 text-green-800 rounded-md  ">
              <svg
                className="shrink-0 size-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              14.5%
            </span>
            <p className="text-xs text-core-gray ">antes $480.503</p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-col p-5 bg-core-light border border-core-gray/30 shadow-xs rounded-xl ">
        <div className="space-y-4">
          <h2 className="text-xs uppercase text-core-gray ">Compras</h2>
          <div className="grid grid-cols-2 gap-x-2">
            <div className="text-2xl font-semibold text-core-dark ">
              $221.336
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs bg-red-100 text-red-800 rounded-md ">
              <svg
                className="shrink-0 size-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              4.1%
            </span>
            <p className="text-xs text-core-gray ">antes $220.229</p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-col p-5 bg-core-light border border-core-gray/30 shadow-xs rounded-xl ">
        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xs uppercase text-core-gray ">
              Clientes Activos
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <div className="text-2xl font-semibold text-core-dark ">123</div>
          </div>
          <div className="flex items-center gap-x-2">
            <div class="flex items-center -space-x-2">
              <img
                class="shrink-0 size-7 shadow-md rounded-full"
                src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                alt="Avatar"
              />
              <span class="flex shrink-0 justify-center items-center size-7 bg-core-light border border-core-gray/30 text-core-dark/80 text-xs font-medium uppercase rounded-full  ">
                L
              </span>
              <img
                class="shrink-0 size-7 shadow-md rounded-full"
                src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                alt="Avatar"
              />
              <img
                class="shrink-0 size-7 shadow-md rounded-full"
                src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                alt="Avatar"
              />
              <span class="flex shrink-0 justify-center items-center size-7 bg-core-light border border-core-gray/30 text-core-dark/80 text-xs font-medium uppercase rounded-full  ">
                O
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resumenes;
