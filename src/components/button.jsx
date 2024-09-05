/* eslint-disable react/prop-types */

export default function Button({ text, topic, img }) {
  return (
    <button
      type="button"
      className="topic-btn border-2 border-[#E9E9E9] p-2 flex flex-row items-center rounded-xl font-medium"
      data-topic={topic}
    >
      <img src={img} alt="" className="mr-3" />
      <p className="truncate">{text}</p>
    </button>
  );
}
