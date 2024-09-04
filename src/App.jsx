import React, { useState, useEffect, useRef } from 'react';
import TopicButton from './components/TopicButton';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from '../gemini-api-banner';

const API_KEY = 'AIzaSyArLHGCVHh-x2eINAJJhPlCdtNkJba5LwA';

export default function App() {
  const [state, setState] = useState('quiz');
  const [output, setOutput] = useState('Hasil akan muncul di sini...');
  const [prompt, setPrompt] = useState('');
  const promptInputRef = useRef(null);
  const outputRef = useRef(null);

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  useEffect(() => {
    maybeShowApiKeyBanner(API_KEY);
  }, []);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setOutput('Memproses...');

    try {
      if (state === 'quiz') {
        const quizPrompt = `Berikan satu pertanyaan singkat tentang topik: ${prompt}`;
        const result = await chat.sendMessage(quizPrompt);
        let md = new MarkdownIt();
        setOutput(md.render(result.response.text()));
        setState('answer');
        promptInputRef.current.value = '';
        promptInputRef.current.placeholder = 'Masukkan jawaban Anda';
      } else if (state === 'answer') {
        const userResponse = promptInputRef.current.value;
        const correctionPrompt = `Periksa jawaban berikut terhadap pertanyaan ini: ${outputRef.current.innerText}. Jawaban: ${userResponse}. Berikan penjelasan singkat apakah jawaban benar atau salah, dan berikan jawaban yang benar jika salah.`;

        const correctionResult = await chat.sendMessage(correctionPrompt);
        let md = new MarkdownIt();
        setOutput(prev => prev + '<h3>Hasil Koreksi:</h3>' + md.render(correctionResult.response.text()));

        setState('reset');
        promptInputRef.current.value = '';
        promptInputRef.current.placeholder = 'Klik untuk kembali ke awal';
      } else if (state === 'reset') {
        setState('quiz');
        setOutput('Hasil akan muncul di sini...');
        promptInputRef.current.placeholder = 'Pilih topik atau masukkan topik baru';
      }
    } catch (e) {
      setOutput(prev => prev + `
        <div class="error-message">
          <hr>
          <p>Terjadi kesalahan: ${e.message}</p>
        </div>
      `);
    }
  };

  return (
    <div>
      <h1>Skillbidi: </h1>
      <h3>Turn Your Free Time into Skill Time!</h3>
      <form onSubmit={handleSubmit}>
        <TopicButton />
        <div className="prompt-box">
          <label>
            <input
              ref={promptInputRef}
              name="prompt"
              placeholder={state === 'quiz' ? "To kill some time, I'm gonna learn about .... " : "Masukkan jawaban Anda"}
              type="text"
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          <button type="submit" id="submit-button">
            {state === 'reset' ? 'Mulai Lagi' : 'Go'}
          </button>
        </div>
      </form>
      <p className="output" ref={outputRef} dangerouslySetInnerHTML={{ __html: output }}></p>
    </div>
  );
}