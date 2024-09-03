import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// Get your Gemini API key by:
// - Selecting "Add Gemini API" in the "Project IDX" panel in the sidebar
// - Or by visiting https://g.co/ai/idxGetGeminiKey
const API_KEY = 'AIzaSyArLHGCVHh-x2eINAJJhPlCdtNkJba5LwA';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');
let submitButton = document.querySelector('#submit-button');

let state = 'quiz'; // 'quiz', 'answer', atau 'reset'

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // or gemini-1.5-pro
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
});

const chat = model.startChat({
  history: [],
  generationConfig:{
    maxOutputTokens: 1000,
  }
})

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Memproses...';

  try {
    if (state === 'quiz') {
      const prompt = `buat satu soal mengenai ${promptInput.value} tanpa memunculkan jawabannya.`;
      const result = await chat.sendMessage(prompt);
      
      let md = new MarkdownIt();
      output.innerHTML = md.render(result.response.text());

      state = 'answer';
      promptInput.value = '';
      promptInput.placeholder = 'Masukkan jawaban Anda di sini';
      submitButton.textContent = 'Kirim Jawaban';
    } else if (state === 'answer') {
      const userResponse = promptInput.value;
      const correctionPrompt = `Periksa jawaban berikut terhadap pertanyaan ini: ${output.innerText}. Jawaban: ${userResponse}. Berikan penjelasan singkat apakah jawaban benar atau salah, dan berikan jawaban yang benar jika salah.`;
      
      const correctionResult = await chat.sendMessage(correctionPrompt);
      let md = new MarkdownIt();
      output.innerHTML += '<h3>Hasil Koreksi:</h3>' + md.render(correctionResult.response.text());

      state = 'reset';
      promptInput.value = '';
      promptInput.placeholder = 'Klik untuk kembali ke awal';
      submitButton.textContent = 'Mulai Lagi';
    } else if (state === 'reset') {
      state = 'quiz';
      output.textContent = 'Hasil akan muncul di sini...';
      promptInput.placeholder = 'Masukkan topik untuk pertanyaan baru';
      submitButton.textContent = 'Buat Pertanyaan';
    }
  } catch (e) {
    output.innerHTML += `
    <div class="error-message">
      <hr>
      <p>Terjadi kesalahan pada website. Harap reload halaman ini.</p>
    </div>
    `;
  }
};

// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);

// Load the image as a base64 string
// let imageUrl = form.elements.namedItem('chosen-image').value;
// let imageBase64 = await fetch(imageUrl)
//   .then(r => r.arrayBuffer())
//   .then(a => Base64.fromByteArray(new Uint8Array(a)));

// Assemble the prompt by combining the text with the chosen image
// let contents = [
//   {
//     role: 'user',
//     parts: [
//       // { inline_data: { mime_type: 'image/jpeg', data: imageBase64, } },
//       { text: promptInput.value }
//     ]
//   }
// ];

// Call the multimodal model, and get a stream of results
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash", // or gemini-1.5-pro
//   safetySettings: [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
//     },
//   ],
// });
