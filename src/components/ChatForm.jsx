import{useRef} from "react";

const ChatForm = ({chatHistory,setChatHistory,generateBotResponse}) =>{
    const inputRef = useRef();
 const handleFormSubmit =(e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if(!userMessage)return;
    inputRef.current.value="";

    setChatHistory((history)=>[...history,{role:"user",text:userMessage}]);

    setTimeout(()=> setChatHistory((history)=> [...history,{role:"model",text :"Carregando..."}]),600);   

    generateBotResponse([...chatHistory,{role:"user",text:`Using the details provided above, plese address this query: ${userMessage}`}])
 // generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);

 };
 return(
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input ref={inputRef} type="text" placeholder="Digite sua mensagem..." className="message-input" required />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>

 );


};
export default ChatForm;