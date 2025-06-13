import logo from "../img/logooficial-removebg-preview.png"; // ajuste o caminho conforme necessário

const ChatbotIcon = () => {
  return (
    <div className="chatbot-icon-wrapper">
      <img src={logo} alt="Logo Apifiz" className="chatbot-logo" />
      <span className="notification-badge">1</span>
    </div>
  );
};

export default ChatbotIcon;
