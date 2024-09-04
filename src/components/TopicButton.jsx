import React, { useState } from 'react';

// Komponen TopicButton
export default function TopicButton() {
  const topics = ['Communication', 'Time Management', 'Problem Solving', 'Critical Thinking'];
  
  // State untuk mengontrol tampilan tombol
  const [showButtons, setShowButtons] = useState(true);
  const [output, setOutput] = useState(''); // State untuk output
  const [promptInput, setPromptInput] = useState(''); // State untuk input prompt
  
  // Fungsi untuk menyembunyikan tombol topik
  const hideTopicButtons = () => {
    setShowButtons(false);
  };

  // Fungsi untuk menampilkan tombol topik
  const showTopicButtons = () => {
    setShowButtons(true);
  };

  // Event handler untuk klik tombol topik
  const handleClick = async (topic) => {
    setPromptInput(topic);
    hideTopicButtons();

    // Otomatis generate pertanyaan
    setOutput('Memproses...');
    try {
      const prompt = `buat satu soal mengenai ${topic} tanpa memunculkan jawabannya.`;
      const result = await chat.sendMessage(prompt); // Asumsikan chat.sendMessage tersedia dan bekerja

      // Render output yang dihasilkan dari chat.sendMessage
      const md = new MarkdownIt();
      setOutput(md.render(result.response.text()));

      setPromptInput('');
    } catch (e) {
      setOutput(`
        <div class="error-message">
          <hr>
          <p>Terjadi kesalahan pada website. Harap reload halaman ini.</p>
        </div>
      `);
    }
  };

  return (
    <div className="topic-buttons" style={{ display: showButtons ? 'flex' : 'none' }}>
      {topics.map((topic, index) => (
        <button
          key={index}
          type="button"
          className="topic-btn"
          data-topic={topic}
          onClick={() => handleClick(topic)} // Memanggil handleClick dengan topik terkait
        >
          {topic}
        </button>
      ))}
      {/* Area untuk menampilkan hasil */}
      <p className="output" dangerouslySetInnerHTML={{ __html: output }}></p>
    </div>
  );
}
