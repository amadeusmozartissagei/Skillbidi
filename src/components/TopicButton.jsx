import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';

// Komponen TopicButton
export default function TopicButton({ setPrompt, genAI, setState, setOutputMain }) {
  const topics = ['Communication', 'Time Management', 'Problem Solving', 'Critical Thinking'];
  
  const [showButtons, setShowButtons] = useState(true);
  const [output, setOutput] = useState('');
  
  const hideTopicButtons = () => {
    setShowButtons(false);
  };

  const showTopicButtons = () => {
    setShowButtons(true);
    setOutput('');
  };

  const handleClick = async (topic) => {
    setPrompt(topic);
    setState('answer');
    setOutputMain(' ');
    hideTopicButtons();

    setOutput('Memproses...');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
      {/* Area untuk menampilkan hasil */}
      <p className="output" dangerouslySetInnerHTML={{ __html: output }}></p>
      {!showButtons && (
        <button onClick={showTopicButtons}>Kembali ke Topik</button>
      )}
    </div>
  );
}