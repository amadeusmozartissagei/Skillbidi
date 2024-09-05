import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';

// Komponen TopicButton
export default function TopicButton({ setPrompt, genAI, setState, setTopicQuestion }) {
  const topics = ['Communication', 'Time Management', 'Problem Solving', 'Critical Thinking'];
  const [output, setOutput] = useState(''); // Penulisan setOutput yang benar
  const [showButtons, setShowButtons] = useState(true);

  const hideTopicButtons = () => {
    setShowButtons(false);
  };

  const showTopicButtons = () => {
    setShowButtons(true);
    setOutput(' ')
  };

  // useEffect(() => {
  //   // Mengirim nilai output awal saat component pertama kali dimount
  //   onOutputChange(output);
  // }, [output, onOutputChange]);

  const handleClick = async (topic) => {
    setPrompt(topic);
    setState('answer');
    hideTopicButtons();

    setOutput('Memproses...');
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
      setOutput(md.render(result.response.text())); 
      setTopicQuestion(result.response.value)
    } catch (e) {
      setOutput(`
        <div class="error-message">
          <hr>
          <p>Terjadi kesalahan: ${e.message}</p>
        </div>
      `);
    }
  };

  return (
    <div>
      <div className="topic-buttons" style={{ display: showButtons ? 'flex' : 'none' }}>
        {topics.map((topic, index) => (
          <button
            key={index}
            type="button"
            className="topic-btn"
            data-topic={topic}
            onClick={() => handleClick(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
      {!showButtons && <button onClick={showTopicButtons}>Kembali ke Topik</button>}
    </div>
  );
}
