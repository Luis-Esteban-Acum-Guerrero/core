const Services = ({ data }) => {
  return (
    <div class="p-4 h-full relative flex flex-col justify-between bg-core-light border border-core-gray/30 rounded-xl">
      <div class="flex justify-between items-center gap-x-2">
        <h2 class="font-semibold text-lg text-core-dark">Estado de Servicios</h2>
        <span class="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-semibold uppercase rounded-md bg-linear-to-tr from-lime-500 to-teal-500 text-white">
          Pro
        </span>
      </div>

      <div class="mt-3 w-40">
        <h4 class="mb-1 text-sm text-core-dark">2 de 4 online</h4>
        <div class="grid grid-cols-4 gap-x-1.5">
          <div class="bg-teal-600  h-2 flex-auto rounded-sm"></div>
          <div class="bg-teal-600  h-2 flex-auto rounded-sm"></div>
          <div class="bg-teal-600 opacity-30 h-2 flex-auto rounded-sm"></div>
          <div class="bg-teal-600 opacity-30 h-2 flex-auto rounded-sm"></div>
        </div>
      </div>

      <p class="mt-3 text-sm text-core-dark/60">
        El <span class="font-semibold text-core-dark">50% </span> de los
        servicios se encuentran activos.
      </p>

      <div class="mt-3 md:mt-5">
        <div class="space-y-1.5">
          <div class="py-2 px-2.5 flex justify-between items-center gap-x-3 bg-core-gray/10 rounded-lg">
            <span class="size-5 flex shrink-0 justify-center items-center bg-teal-600 text-white rounded-full">
              <svg
                class="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </span>

            <div class="grow">
              <div class="flex justify-between items-center gap-x-1.5">
                <div class="grow">
                  <s class="text-sm text-gray-400">c0re API</s>
                </div>
                <div>
                  <span class="flex relative z-10">
                    <span class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75 dark:bg-red-600"></span>
                    <span class="relative min-w-2.5 min-h-2.5 inline-flex justify-center items-center text-[10px] bg-red-500 text-white rounded-full px-1"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="py-2 px-2.5 flex justify-between items-center gap-x-3 bg-core-gray/10 rounded-lg">
            <span class="size-5 flex shrink-0 justify-center items-center text-core-dark">
              <svg
                class="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                <path d="M10 6h4" />
                <path d="M10 10h4" />
                <path d="M10 14h4" />
                <path d="M10 18h4" />
              </svg>
            </span>

            <div class="grow">
              <div class="flex justify-between items-center gap-x-1.5">
                <div class="grow">
                  <span class="text-sm text-core-dark">Bot extractor</span>
                </div>
                <div>
                  <div>
                    <span class="flex relative z-10">
                      <span class="animate-ping absolute inline-flex size-full rounded-full bg-green-400 opacity-75 dark:bg-green-600"></span>
                      <span class="relative min-w-2.5 min-h-2.5 inline-flex justify-center items-center text-[10px] bg-green-500 text-white rounded-full px-1"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="py-2 px-2.5 flex justify-between items-center gap-x-3 bg-core-gray/10 rounded-lg">
            <span class="size-5 flex shrink-0 justify-center items-center bg-teal-600 text-white rounded-full">
              <svg
                class="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </span>

            <div class="grow">
              <div class="flex justify-between items-center gap-x-1.5">
                <div class="grow">
                  <s class="text-sm text-gray-400">
                    Transformador de formatos SCHEMA
                  </s>
                </div>
                <div>
                  <span class="flex relative z-10">
                    <span class="animate-ping absolute inline-flex size-full rounded-full bg-green-400 opacity-75 dark:bg-green-600"></span>
                    <span class="relative min-w-2.5 min-h-2.5 inline-flex justify-center items-center text-[10px] bg-green-500 text-white rounded-full px-1"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="py-2 px-2.5 flex justify-between items-center gap-x-3 bg-core-gray/10 rounded-lg">
            <span class="size-5 flex shrink-0 justify-center items-center text-core-dark">
              <svg
                class="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                <path d="M8 10v4" />
                <path d="M12 10v2" />
                <path d="M16 10v6" />
              </svg>
            </span>

            <div class="grow">
              <div class="flex justify-between items-center gap-x-1.5">
                <div class="grow">
                  <span class="text-sm text-core-dark">Validación de data</span>
                </div>
                <div>
                  <div>
                    <span class="flex relative z-10">
                      <span class="relative min-w-2.5 min-h-2.5 inline-flex justify-center items-center text-[10px] bg-gray-400 text-white rounded-full px-1"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
