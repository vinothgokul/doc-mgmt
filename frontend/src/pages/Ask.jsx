import { useState } from "react";
import { useDocument } from "../context/DocumentContext";
import { useNavigate } from "react-router-dom";

export default function Ask() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { ask } = useDocument();
  const navigate = useNavigate();

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    setMessages((prev) => [...prev, {type: "user", text: question}]);

    try {
      const response = await ask({question});
      setMessages((prev) => [...prev, {type: "bot", text: response.data.answer}]);
    }
    catch(error) {
      setMessages((prev) => [...prev, {type: "bot", text: "Error fetching answer."}]);
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div className="chat-container">
      <div className="container-header">  
        <h2>Ask a Question</h2>
        <div className="button-group">
          <button type="button" onClick={()=>navigate(-1)}>Close</button>
        </div>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => {
          return(
            <div key={index} className={`chat-message ${msg.type}`}>
              <p>{msg.text}</p>
            </div>
          )
        })}
        {loading && <div className="chat-messages bot">Typing...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={handleAsk} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
