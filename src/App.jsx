import React, { useState, useEffect, useRef } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import TextareaAutosize from 'react-textarea-autosize';
import MarkdownIt from "markdown-it";
import { maybeShowApiKeyBanner } from "../gemini-api-banner";
import TopicButton from "./components/TopicButton";
import Header from "./components/header";
import { ClipLoader } from "react-spinners";
import Popup from "./components/Popup1";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [state, setState] = useState("quiz");
  const [parentOutput, setParentOutput] = useState(
    "Hasil akan muncul di sini..."
  );
  const [prompt, setPrompt] = useState("");
  const promptInputRef = useRef(null);
  const outputRef = useRef(null);
  const [topicsQuestion, setTopicQuestion] = useState(" ");
  const [message, setMessage] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chat, setChat] = useState(null);
  

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

  const messageHandler = () => {
    setMessage(false);
  };

  const sendMessageToGemini = async (prompt) => {
    try {
      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw error;
    }
  };

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
      setParentOutput("Topik tidak boleh kosong.");
      return;
    }

    setIsProcessing(true);
    setParentOutput("Memproses...");

    try {
      let newOutput = "Memproses...";
      const md = new MarkdownIt();

      if (state === "quiz") {
        const quizPrompt = `Berikan satu pertanyaan singkat tentang topik: ${prompt}`;
        const questionText = await sendMessageToGemini(quizPrompt);
        newOutput = md.render(questionText);
        setState("answer");
        setTopicQuestion(questionText);

        if (promptInputRef.current) {
          promptInputRef.current.value = "";
          promptInputRef.current.placeholder = "Masukkan jawaban Anda";
        }
      } else if (state === "answer") {
        const userResponse = promptInputRef.current?.value || "";
        const correctionPrompt = `Berikut adalah pertanyaan: "${topicsQuestion}". Jawaban pengguna: "${userResponse}". Evaluasi jawaban tersebut. Jika benar, berikan penjelasan singkat mengapa benar. Jika salah, berikan jawaban yang benar dan penjelasan singkat.`;

        const correctionText = await sendMessageToGemini(correctionPrompt);
        newOutput = `<h3>Hasil Evaluasi:</h3>${md.render(correctionText)}`;
        setState("reset");

        if (promptInputRef.current) {
          promptInputRef.current.value = "";
          promptInputRef.current.placeholder = "Up for another round of skill time? ;) --->";
        }
      } else if (state === "reset") {
        setState("quiz");
        newOutput = "Hasil akan muncul di sini...";

        if (promptInputRef.current) {
          promptInputRef.current.placeholder = "Pilih topik atau masukkan topik baru";
        }
      }

      setParentOutput(newOutput);
    } catch (e) {
      setParentOutput(
        `<div class="error-message">
          <hr>
          <p>Terjadi kesalahan: Harap reload halaman ini</p>
        </div>`
      );
      console.error("Error processing the request:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonImage = (state === "reset" ? './images/reset.svg' : "./images/send.svg") ;

  const topics = [
    "Communication",
    "Time Management",
    "Problem Solving",
    "Critical Thinking",
  ];

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="flex flex-col h-screen font-poppins">
      <Header />
      <Popup />
      
      <div className="flex flex-col flex-grow">
        <form
          className="w-full h-full flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-grow flex-col w-full justify-center items-center">
            <h1 className="logo font-semibold text-3xl ml:text-4xl md:text-6xl mb-2 md:mb-4 text-center">
              Welcome to Skillbidi
            </h1>
            <h3 className="text-[#BDBFC3] text-lg md:text-2xl mb-4 md:mb-8 text-center">
              Turn Your Free Time into Skill Time!
            </h3>
            {isProcessing ? (
              <ClipLoader size={50} color={"#8BC6F2"} />
            ) : state === "quiz" ? (
              <div className="topic-buttons grid grid-cols-1 ml:grid-cols-2 w-11/12 md:w-5/12 gap-x-4 gap-y-2">
                <TopicButton
                  setPrompt={setPrompt}
                  genAI={genAI}
                  setState={setState}
                  setTopicQuestion={setTopicQuestion}
                  setParentOutput={setParentOutput}
                />
              </div>
            ) : (
              <div className="w-10/12 font-semibold text-lg">
                <div
                  className="output bg-blue-100 border-2 border-blue-400 p-4 rounded-xl shadow-md"
                  ref={outputRef}
                  dangerouslySetInnerHTML={{ __html: parentOutput }}
                ></div>
              </div>
            )}
          </div>
          <div className="prompt-box flex justify-center w-full mb-10 z-0">
            <div className="relative w-10/12 md:w-8/12 border border-[#8BC6F2] rounded-3xl group">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only"
              >
                Search
              </label>
              <TextareaAutosize
                name="prompt"
                ref={promptInputRef}
                type="text"
                id="default-search"
                className="block w-full p-4 h-14 text-sm focus:ring-blue-400 focus:border-blue-400 text-gray-900 rounded-3xl bg-white placeholder:truncate z-0"
                placeholder={
                  state === "quiz"
                    ? "To kill some time, I'm gonna learn about .... "
                    : "You can just reply here ;)"
                }
                required
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={state === "reset"}
              />
              <button
                type="submit"
                id="submit-button"
                className="text-white absolute end-2.5 bottom-1 bg-white focus:ring-4 font-medium rounded-full p-2"
              >
                <img src={buttonImage} alt="" />
              </button>
            </div>
          </div>
        </form>
        {/* <p
          className="output"
          ref={outputRef}
          dangerouslySetInnerHTML={{ __html: parentOutput }}
        ></p> */}
      </div>
    </div>
  );
}
