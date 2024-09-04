/* eslint-disable react/prop-types */
import Popup from "./popup";

export default function Header() {
  return (
    <div className="flex flex-row justify-between px-4 md:px-7 py-4">
      <div className="flex flex-row items-center">
        <img src="/images/gemini.svg" alt="" className="w-10 h-10" />
        <h1 className="font-poppins font-medium text-2xl">Skillbidi</h1>
      </div>
      <Popup />
    </div>
  );
}
