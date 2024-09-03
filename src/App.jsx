import React from 'react';

export default function App() {
  return (
  <>
  <h1>Skillbidi: </h1>
      <h3>Turn Your Free Time into Skill Time!</h3>
      <form>
        <div className="topic-buttons">
          <button type="button" className="topic-btn"
            data-topic="Communication">Communication</button>
          <button type="button" className="topic-btn"
            data-topic="Time Management">Time Management</button>
          <button type="button" className="topic-btn"
            data-topic="Problem-Solving">Problem-Solving</button>
          <button type="button" className="topic-btn"
            data-topic="Critical Thinking">Critical Thinking</button>
        </div>
        <div className="prompt-box">
          <label>
            <input name="prompt"
              placeholder="To kill some time, I'm gonna learn about .... "
              type="text"/>
          </label>
          <button type="submit" id="submit-button">Go</button>
        </div>
      </form>
      <p className="output">results will appear here...</p>
      <div id="answerSection" style={{ display: 'none' }}>
        <input type="text" id="userAnswer" placeholder="Jawaban Anda" />
        <button id="submitAnswerBtn">Submit Answer</button>
        <div id="feedback"></div>
        <div className="button-group">
          <button id="nextQuestionBtn" style={{ display: 'none' }}>Pertanyaan
            Selanjutnya</button>
          <button id="correctAnswerBtn" style={{ display: 'none' }}>Koreksi Jawaban
            Lagi</button>
        </div>
      </div>

      <script type="module" src="./utils/main.js"></script>
  </>
  )
}

