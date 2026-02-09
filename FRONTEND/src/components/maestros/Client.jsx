const Client = ({ data }) => {
  return (
    <div class="flex flex-col w-md bg-core-light border border-core-gray rounded-xl ">
      <figure class="shrink-0 relative h-24 overflow-hidden rounded-t-xl">
        <svg
          class="w-full h-24 rounded-t-xl"
          preserveAspectRatio="xMidYMid slice"
          width="576"
          height="120"
          viewBox="0 0 576 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_666_273469qedas2)">
            <rect width="576" height="120" fill="#B2E7FE" />
            <rect
              x="289.678"
              y="-90.3"
              width="102.634"
              height="391.586"
              transform="rotate(59.5798 289.678 -90.3)"
              fill="#FF8F5D"
            />
            <rect
              x="41.3926"
              y="-0.996094"
              width="102.634"
              height="209.864"
              transform="rotate(-31.6412 41.3926 -0.996094)"
              fill="#3ECEED"
            />
            <rect
              x="66.9512"
              y="40.4817"
              width="102.634"
              height="104.844"
              transform="rotate(-31.6412 66.9512 40.4817)"
              fill="#4C48FF"
            />
          </g>
          <defs>
            <clipPath id="clip0_666_273469qedas2">
              <rect width="576" height="120" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </figure>

      <div class="-mt-8 px-4 mb-3">
        <div class="relative flex items-center gap-x-3">
          <div class="relative w-20">
            <img
              class="shrink-0 size-20 ring-4 ring-core-light rounded-3xl   bg-core-light"
              src={data.logo}
              alt={data.company}
            />
            <div class="absolute -bottom-3 inset-x-0 text-center">
              <span class="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-semibold uppercase rounded-md bg-core-primary text-core-dark">
                Pro
              </span>
            </div>
          </div>

          <div class="absolute bottom-2 end-0">
            <div class="h-full flex justify-end items-end gap-x-2">
              <button
                type="button"
                class="hs-tooltip flex justify-center items-center gap-x-3 size-8 text-sm border border-core-gray/20 text-core-dark/70 hover:opacity-80 hover:bg-core-gray/10 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-gray/10  "
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
                  class="flex justify-center items-center gap-x-3 size-8 text-sm border border-core-gray/20 text-core-dark/70 hover:opacity-80 hover:bg-core-gray/10 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-gray/10  "
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
                  class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-11 bg-core-light rounded-xl shadow-xl "
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
      </div>

      <div class="p-4 h-full">
        <h2 class="mb-2 font-medium text-core-dark ">{data.company}</h2>

        <dl class="grid grid-cols-2 gap-x-2">
          <dt class="py-1 text-sm text-core-gray ">Role:</dt>
          <dd class="py-1 inline-flex justify-end items-center gap-x-2 text-end font-medium text-sm text-core-dark ">
            Front-End Developer
          </dd>

          <dt class="py-1 text-sm text-core-gray ">Phone:</dt>
          <dd class="py-1 inline-flex justify-end items-center gap-x-2 text-end font-medium text-sm text-core-dark ">
            (892) 312-5483
          </dd>

          <dt class="py-1 text-sm text-core-gray ">Email:</dt>
          <dd class="py-1 inline-flex justify-end items-center gap-x-2 text-end font-medium text-sm text-core-dark ">
            amanda@email.com
          </dd>

          <dt class="py-1 text-sm text-core-gray ">Hourly price:</dt>
          <dd class="py-1 inline-flex justify-end items-center gap-x-2 text-end font-medium text-sm text-core-dark">
            $35-$55
          </dd>
        </dl>

        <div class="mt-3 flex flex-wrap gap-1">
          <span class="py-1 px-2.5 inline-flex items-center gap-x-1 text-xs rounded-md bg-core-light border border-core-gray text-core-dark ">
            Designer
          </span>
          <span class="py-1 px-2.5 inline-flex items-center gap-x-1 text-xs rounded-md bg-core-light border border-core-gray text-core-dark ">
            Front-End
          </span>
          <span class="py-1 px-2.5 inline-flex items-center gap-x-1 text-xs rounded-md bg-core-light border border-core-gray text-core-dark ">
            Brand Designer
          </span>
          <span class="py-1 px-2.5 inline-flex items-center gap-x-1 text-xs rounded-md bg-core-light border border-core-gray text-core-dark ">
            Tool
          </span>
          <div class="hs-dropdown inline-block">
            <button
              id="hs-pro-wcctdid1"
              type="button"
              class="py-1 px-2.5 inline-flex items-center gap-x-1 text-xs rounded-md bg-core-light border border-core-gray text-core-dark cursor-pointer "
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              +2
            </button>
            <div
              class="hs-dropdown-menu hs-dropdown-open:opacity-100 max-w-64 transition-[opacity,margin] duration opacity-0 hidden overflow-hidden z-10 p-2 bg-core-gray/10 border border-core-gray rounded-lg "
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-pro-wcctdid1"
            >
              <span class="py-1 px-2.5 inline-flex items-center gap-x-1 text-xs rounded-md bg-core-light border border-core-gray text-core-dark ">
                Web
              </span>
              <span class="py-1 px-2.5 inline-flex items-center gap-x-1 text-xs rounded-md bg-core-light border border-core-gray text-core-dark ">
                UI/UX
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="py-3 px-4 flex items-center gap-x-3 border-t border-core-gray ">
        <button
          type="button"
          class="w-full py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-[13px] font-medium rounded-lg border border-core-gray bg-core-light text-core-dark shadow-2xs hover:opacity-80 hover:bg-core-light disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-core-light "
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
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
          </svg>
          Contact
        </button>
        <a
          class="w-full flex justify-center items-center gap-x-1.5 py-2 px-2.5 border border-transparent bg-teal-600 font-medium text-[13px] text-white hover:opacity-80 hover:bg-teal-700 rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-teal-700 "
          href="../../pro/workspace/talent-details.html"
        >
          View profile
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
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Client;
