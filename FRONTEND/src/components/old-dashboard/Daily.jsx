const Daily = ({ data }) => {
  return (
    <div className="flex flex-col w-md bg-core-light border border-core-gray/30 truncate rounded-xl">
      {/* Header */}
      <div className="p-4 relative flex gap-x-3">
        {/* Logo */}
        <div className="shrink-0">
          <div className="shrink-0 border border-core-gray/30 rounded-xl">
            <div className="size-12 flex justify-center items-center">
              <img src={data.logo} alt={data.company} className="size-6" />
            </div>
          </div>
        </div>

        <div className="grow truncate mt-1">
          <div className="pe-7">
            <span className="block text-sm text-core-dark ">{data.company}</span>
          </div>

          <div className="hs-tooltip shrink-0 block">
            <h4 className="hs-tooltip-toggle font-medium truncate text-core-dark ">
              {data.title}
            </h4>
          </div>
        </div>

        <div class="absolute end-4">
          <div class="h-full flex justify-end items-end gap-x-2">
            <button
              type="button"
              class="hs-tooltip flex justify-center items-center gap-x-3 size-8 text-sm border border-core-gray/30 text-core-dark/60 hover:opacity-80 hover:bg-core-gray/10 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-gray/10"
            >
              <svg
                class="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span class="sr-only">Favoritos</span>
              <span
                class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-core-dark text-xs text-white rounded-lg whitespace-nowrap "
                role="tooltip"
              >
                Favoritos
              </span>
            </button>

            <div class="hs-dropdown [--strategy:absolute] [--placement:bottom-right] relative inline-flex">
              <button
                id="hs-pro-wccmdid1"
                type="button"
                class="flex justify-center items-center gap-x-3 size-8 text-sm border border-core-gray/30 text-core-dark/60 hover:opacity-80 hover:bg-core-gray/10 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-gray/10 "
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>

              <div
                class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-11 bg-core-light rounded-xl shadow-xl"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-pro-wccmdid1"
              >
                <div class="p-1 space-y-0.5">
                  <button
                    type="button"
                    class="w-full flex items-center gap-x-2 py-1.5 px-2 rounded-lg text-xs text-core-dark hover:opacity-80 hover:bg-core-gray/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-gray/10 "
                  >
                    <svg
                      class="shrink-0 size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" x2="12" y1="2" y2="15" />
                    </svg>
                    Share
                  </button>
                  <button
                    type="button"
                    class="w-full flex items-center gap-x-2 py-1.5 px-2 rounded-lg text-xs text-core-dark hover:opacity-80 hover:bg-core-gray/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-gray/10 "
                  >
                    <svg
                      class="shrink-0 size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m4.9 4.9 14.2 14.2" />
                    </svg>
                    Block user
                  </button>
                  <button
                    type="button"
                    class="w-full flex items-center gap-x-2 py-1.5 px-2 rounded-lg text-xs text-core-dark hover:opacity-80 hover:bg-core-gray/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-gray/10 "
                  >
                    <svg
                      class="shrink-0 size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-3 grid grid-cols-3 border-y border-core-gray/30 divide-x divide-gray-200">
        {data.stats.map((stat, index) => (
          <div key={index} className="px-4">
            <p className="font-semibold text-sm text-core-dark">{stat.value}</p>
            <p className="text-sm text-core-gray">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-y-4">
        {data.details.map((detail, index) => (
          <div key={index} className="flex items-center gap-x-2">
            <p className="min-w-20 text-sm text-core-gray">{detail.label}</p>
            <div className="grow">{detail.content}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto py-3 px-4 flex items-center border-t border-core-gray/30">
        <div className="flex items-center gap-x-2">
          <span className="flex items-center gap-x-1 text-sm text-core-gray">
            <svg
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
            </svg>
            {data.comments}
          </span>
          <span className="flex items-center gap-x-1 text-sm text-core-gray">
            <svg
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            {data.attachments}
          </span>
        </div>

        <div className="ms-auto flex items-center gap-x-2">
          <div className="w-32 bg-core-gray/30 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <span className="text-sm text-core-gray">{data.progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Daily;
