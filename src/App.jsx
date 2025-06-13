import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      role: "model",
      text: "👋 Olá! Bem-vindo(a) à *Apifiz*! Somos especialistas em *películas, adesivos e comunicação visual*. Como posso te ajudar hoje?",
    },
  ]);

  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef(null);

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Copiando..."),
        {
          role: "model",
          text,
          isError,
        },
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedHistory }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Algo deu errado.");
      }

      const apiResponseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.contents?.parts?.[0]?.text ||
        "Resposta não encontrada.";

      const cleanText = apiResponseText.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(cleanText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  const handleQuickReply = (text) => {
    setChatHistory((prev) => [...prev, { role: "user", text }]);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { role: "model", text: "Copiando..." }]);
    }, 600);
    generateBotResponse([...chatHistory, { role: "user", text }]);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <ChatbotIcon />
      </button>

      <div className="chatbot-popup">
        {/* Cabeçalho */}
        <div className="header-info">
          <ChatbotIcon />
          <h2 className="logo-text">Apifiz</h2>
        </div>
        <button
          onClick={() => setShowChatbot(false)}
          className="material-symbols-rounded"
          style={{ alignSelf: "flex-end", marginRight: "10px", marginTop: "-10px" }}
        >
          keyboard_arrow_down
        </button>

        {/* Corpo do Chat */}
        <div className="chat-body" ref={chatBodyRef}>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}

          {chatHistory.length === 1 && (
            <div className="quick-replies">
              <button onClick={() => handleQuickReply("Adesivos personalizados")}>🖼️ Adesivos personalizados</button>
              <button onClick={() => handleQuickReply("Quero um orçamento")}>💸 Quero um orçamento</button>
              <button onClick={() => handleQuickReply("Ver serviços oferecidos")}>📦 Ver serviços oferecidos</button>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
