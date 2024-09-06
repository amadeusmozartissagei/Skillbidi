import React, {useState} from "react";

export default function Popup() {
    const [popup, setPopup] = useState(true);

    const togglePopup = () => {
      setPopup(!popup);
    };

  return (
    <>
      {popup && (
        <div className="modal w-screen h-screen inset-0 fixed z-50">
        <div className="overlay w-screen h-screen inset-0 fixed bg-slate-800/[0.5]" onClick={togglePopup}></div>
        <div className="modal-content bg-white absolute max-w-[1000px] min-w-[800px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Selamat Datang di Skillbidi
            </h3>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            You can choose any topic to create quizzes that match your interests and level up your skills during your free time. Enjoy your skill time!
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