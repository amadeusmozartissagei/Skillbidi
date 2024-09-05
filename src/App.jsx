import React, { useState, useEffect, useRef } from 'react';
import TopicButton from './components/TopicButton';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from '../gemini-api-banner';

const API_KEY = 'AIzaSyArLHGCVHh-x2eINAJJhPlCdtNkJba5LwA';

export default function App() {
  const [state, setState] = useState('quiz');
  const [parentOutput, setParentOutput] = useState('Hasil akan muncul di sini...');
  const [prompt, setPrompt] = useState('');
  const promptInputRef = useRef(null);
  const outputRef = useRef(null);
  const [topicsQuestion, setTopicQuestion] = useState(' ');

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  const [chat, setChat] = useState(null);

  useEffect(() => {
    maybeShowApiKeyBanner(API_KEY);
    // Initialize chat when the component loads
    const initialChat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    setChat(initialChat);
  }, []);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
  
    if (!prompt) {
      setParentOutput('Topik tidak boleh kosong.');
      return;
    }
  
    // Set the processing message
    setParentOutput('Memproses...');
  
    try {
      let newOutput = 'Memproses...';
  
      if (state === 'quiz') {
        const quizPrompt = `Berikan satu pertanyaan singkat tentang topik: ${prompt}`;
        const result = await chat.sendMessage(quizPrompt);
        const md = new MarkdownIt();
        const questionText = result.response.text();
        newOutput = md.render(questionText);
        setState('answer');
  
        if (promptInputRef.current) {
          promptInputRef.current.value = '';
          promptInputRef.current.placeholder = 'Masukkan jawaban Anda';
        }
        console.log('ini state quiz')
      } else if (state === 'answer') {
        const userResponse = promptInputRef.current?.value || '';
        const correctionPrompt = `Periksa jawaban berikut terhadap pertanyaan ini: ${promptInputRef.current?.value || topicsQuestion}. Jawaban: ${userResponse}. Berikan penjelasan singkat apakah jawaban benar atau salah, dan berikan jawaban yang benar jika salah.`;
  
        const correctionResult = await chat.sendMessage(correctionPrompt);
        const md = new MarkdownIt();
        newOutput = `<h3>Hasil Koreksi:</h3>${md.render(correctionResult.response.text())}`;
        setState('reset');
  
        if (promptInputRef.current) {
          promptInputRef.current.value = '';
          promptInputRef.current.placeholder = 'Klik untuk kembali ke awal';
        }
        console.log('ini state answer')
      } else if (state === 'reset') {
        setState('quiz');
        newOutput = 'Hasil akan muncul di sini...';
  
        if (promptInputRef.current) {
          promptInputRef.current.placeholder = 'Pilih topik atau masukkan topik baru';
        }
      }
  
      // Update the output with the new content
      setParentOutput(newOutput);
    } catch (e) {
      setParentOutput(
        (prev) =>
          `${prev}
          <div class="error-message">
            <hr>
            <p>Terjadi kesalahan: Harap reload halaman ini.</p>
          </div>
        `
      );
      console.error('Error processing the request:', e);
    }
  };
  

  return (
    <div>
      <h1>Skillbidi: </h1>
      <h3>Turn Your Free Time into Skill Time!</h3>
      <form onSubmit={handleSubmit}>
        <TopicButton
          setPrompt={setPrompt}
          genAI={genAI}
          setState={setState}
          setTopicQuestion={setTopicQuestion}
          setParentOutput={setParentOutput} // Pass setParentOutput as prop
        />
        <div className="prompt-box">
          <label>
            <input
              ref={promptInputRef}
              name="prompt"
              placeholder={
                state === 'quiz'
                  ? "To kill some time, I'm gonna learn about .... "
                  : 'Masukkan jawaban Anda'
              }
              type="text"
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          <button type="submit" id="submit-button">
            {state === 'reset' ? 'Mulai Lagi' : 'Go'}
          </button>
        </div>
      </form>
      <p
        className="output"
        ref={outputRef}
        dangerouslySetInnerHTML={{ __html: parentOutput }}
      ></p>
    </div>
  );
}
