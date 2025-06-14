import ChatbotIcon from "./ChatbotIcon";

// Converte *negrito* para <strong>
const parseMarkdown = (text) => {
  return text
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
};

const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div className={`message ${chat.role === "model" ? "bot" : "user"}-message ${chat.isError ? "error" : ""}`}>
        {chat.role === "model"}
        <p
          className="message-text"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(chat.text) }}
        ></p>
      </div>
    )
  );
};

export default ChatMessage;
