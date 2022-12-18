import React from 'react';

function FormViewHeader({form}) {

//   const [searchModalOpen, setSearchModalOpen] = useState(false)

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
            {/* Header: Left side */}
            <div className="flex">

                {form.loading
                ?
                    <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-full bg-gray-200 rounded-full dark:bg-gray-300 w-48 mb-4"></div>
                    </div>
                :
                    <a href="#" className="no-underline">
                        <h1 className="tracking-wider font-medium leading-tight text-2xl text-gray-800 hover:text-zinc-600 subpixel-antialiased">
                            {form.data?.companyName}
                        </h1>
                    </a>
                }

            </div>

            {/* Header: Right side */}
            {/*
            <div className="flex items-center">

                <button
                className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ml-3 ${searchModalOpen && 'bg-slate-200'}`}
                onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}
                aria-controls="search-modal"
                >
                <span className="sr-only">Search</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-current text-slate-500" d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                    <path className="fill-current text-slate-400" d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
                </button>
                <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
                <Notifications />
                <Help />
                <hr className="w-px h-6 bg-slate-200 mx-3" />
                <UserMenu />

            </div>
            */}

        </div>
      </div>
    </header>
  );
}

export default FormViewHeader;