
import React from "react";
import Header from "./components/header";
import Button from "./components/button";


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
    <div className="flex flex-col h-screen font-poppins">
      <Header />

      <div className="flex flex-col h-full items-center justify-center">
        <form className="w-full h-full flex flex-col justify-center items-center">
          <div className="flex flex-grow flex-col w-full justify-center items-center ">
            <h1 className="font-semibold text-3xl ml:text-4xl md:text-6xl mb-2 md:mb-4 text-center">
              Welcome to Skillbidi
            </h1>
            <h3 className="text-[#BDBFC3] text-lg md:text-2xl mb-4 md:mb-8 text-center">
              Turn Your Free Time into Skill Time!
            </h3>

            <div className="topic-buttons grid grid-cols-1 ml:grid-cols-2 w-11/12 md:w-5/12 gap-x-4 gap-y-2">
              <Button
                text="Communication"
                topic="communication"
                img="./images/comm.svg"
              />
              <Button
                text="Time Management"
                topic="time-management"
                img="./images/time-man.svg"
              />
              <Button
                text="Problem-Solving"
                topic="problem-solving"
                img="./images/prob-solv.svg"
              />
              <Button
                text="Critical Thinking"
                topic="critical-thinking"
                img="./images/crt-tkg.svg"
              />
            </div>
          </div>
          <div className="prompt-box flex justify-center w-full mb-10 z-0">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative w-10/12 md:w-8/12">
              <input
                name="prompt"
                type="text"
                id="default-search"
                className="block w-full p-4 text-sm text-gray-900 border-2 border-[#8BC6F2] rounded-full bg-white focus:ring-[#BDAFEE] focus:border-[#BDAFEE] placeholder:truncate z-0"
                placeholder="To kill some time, I'm gonna learn about .... "
                required
              />
              <button
                type="submit"
                id="submit-button"
                className="text-white absolute end-2.5 bottom-1.5 bg-white focus:ring-4  font-medium rounded-full p-2"
              >
                <img src="./images/send.svg" alt="" />
              </button>
            </div>
            {/* <label className="w-8/12 flex flex-row relative">
            <input
              name="prompt"
              placeholder="To kill some time, I'm gonna learn about .... "
              type="text"
              className="rounded-full w-full border-2 border-[#8BC6F2]"
            />
            <img src="./images/send.svg" alt="" className="w-10 h-10"/>
          </label> */}
            {/* <button type="submit" id="submit-button">
            Go
          </button> */}
          </div>
        </form>

        {/* <p className="output">results will appear here...</p>
        <div id="answerSection" style={{ display: "none" }}>
          <input type="text" id="userAnswer" placeholder="Jawaban Anda" />
          <button id="submitAnswerBtn">Submit Answer</button>
          <div id="feedback"></div>
          <div className="button-group">
            <button id="nextQuestionBtn" style={{ display: "none" }}>
              Pertanyaan Selanjutnya
            </button>
            <button id="correctAnswerBtn" style={{ display: "none" }}>
              Koreksi Jawaban Lagi
            </button>
          </div>
        </div>

        <script type="module" src="./utils/main.js"></script> */}
      </div>

    </div>
  );
}
