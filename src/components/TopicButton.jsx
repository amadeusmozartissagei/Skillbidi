import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';

// Komponen TopicButton
export default function TopicButton({ setPrompt, genAI, setState, setTopicQuestion, setParentOutput }) {
  const topics = ['Communication', 'Time Management', 'Problem Solving', 'Critical Thinking'];
  const [showButtons, setShowButtons] = useState(true);

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
      setState('answer')
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
    <div>
      <div className="topic-buttons">
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
    </div>
  );
}
