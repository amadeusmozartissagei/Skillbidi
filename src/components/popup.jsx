import React, {useState} from "react";

export default function Popup() {
    const [popup, setPopup] = useState(false);

    const togglePopup = () => {
      setPopup(!popup);
    };

  return (
    <>
      <button onClick={togglePopup} className="btn-popup">
        <img src="/images/question.svg" alt="" />
      </button>

      {popup && (
        <div className="modal w-screen h-screen inset-0 fixed z-50">
        <div className="overlay w-screen h-screen inset-0 fixed bg-slate-800/[0.5]" onClick={togglePopup}></div>
        <div className="modal-content bg-white absolute max-w-[1000px] min-w-[800px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
              About Skillbidi
            </h3>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              UI Skillbidi dikembangkan selama 1 minggu lamaya oleh H.Prof.Dr.
              Hamza M.CS M.2R XTC
            </p>
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 justify-center">
            <button
              onClick={togglePopup}
              type="button"
              className="close-modal text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Try it now
            </button>
          </div>
        </div>
      </div>
      )}

    </>
  );
}