import React from 'react';
import MarkdownIt from 'markdown-it';

// Komponen TopicButton
export default function TopicButton({ setPrompt, genAI, setState, setTopicQuestion, setParentOutput }) {
  const resources = [{
    text: "Communication",
    img: "./images/comm.svg",
    topic: "communication"
  },{
    text: "Time Management",
    img: "./images/time-man.svg",
    topic: "time-management"
  },  {
    text: "Problem-Solving",
    img: "./images/prob-solv.svg",
    topic: "problem-solving"
  },{
    text: "Critical Thinking",
    img: "./images/crt-tkg.svg",
    topic: "critical-thinking"
  }];
  
  const handleClick = async (topic) => {
    setPrompt(topic);
    setState('answer');

    setParentOutput('Memproses...');
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const prompt = `Buat satu soal mengenai ${topic} tanpa memunculkan jawabannya.`;
      const result = await chat.sendMessage(prompt);

      const md = new MarkdownIt();
      const output = md.render(result.response.text());
      setState('answer');
      // Update parentOutput in App component
      setParentOutput(output);
      setTopicQuestion(result.response.value);
    } catch (e) {
      setParentOutput(`
        <div class="error-message">
          <hr>
          <p>Terjadi kesalahan: Harap reload halaman ini.</p>
        </div>
      `);
    }
  };

  return (
    <div className="topic-buttons grid grid-cols-1 md:grid-cols-2 gap-4">
      {resources.map((resource, index) => (
        <button
          key={index}
          type="button"
          className="topic-btn border-2 border-[#E9E9E9] p-2 flex flex-row items-center rounded-xl font-medium"
          onClick={() => handleClick(resource.topic)}
        >
          <img src={resource.img} alt={resource.text} className="mr-3" />
          <p className="truncate">{resource.text}</p>
        </button>
      ))}
    </div>
  );
}
