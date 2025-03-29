import { FC, useState, useRef, useEffect } from 'react';
import { FormattedFreelancer } from '../types/freelancer';
import styles from '../styles/Home.module.css';

interface Message {
  id: string;
  sender: 'user' | 'freelancer';
  text: string;
  timestamp: Date;
}

interface ChatProps {
  freelancer: FormattedFreelancer;
  onClose: () => void;
}

const suggestedMessages = [
  "What are your qualifications?",
  "Can you negotiate on the price?",
  "When can you start?",
  "What's your experience with similar projects?",
  "Do you have a portfolio?",
  "What's your preferred working schedule?",
  "Can you work in my timezone?",
  "What's your development process?",
];

const Chat: FC<ChatProps> = ({ freelancer, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setShowSuggestions(false);

    // Simulate freelancer response
    setTimeout(() => {
      const freelancerMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'freelancer',
        text: getFreelancerResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, freelancerMessage]);
    }, 1000);
  };

  const getFreelancerResponse = (question: string): string => {
    const responses: { [key: string]: string } = {
      "qualifications": `I have ${freelancer.experience || '5+ years'} of experience and specialize in ${freelancer.skills.join(', ')}.`,
      "price": `My standard rate is $${freelancer.hourlyRate}/hr, but I'm open to discussing project-specific rates.`,
      "start": "I can start immediately or within a week, depending on the project scope.",
      "experience": `I've completed ${freelancer.completedProjects} projects successfully with a ${freelancer.rating}/5 rating.`,
      "portfolio": "I'd be happy to share my portfolio. Would you like me to send some relevant examples?",
      "schedule": "I typically work standard business hours but can be flexible based on project needs.",
      "timezone": "I can adjust my schedule to overlap with your working hours for better collaboration.",
      "process": "I follow an agile development process with regular updates and milestone reviews.",
    };

    const keywords = Object.keys(responses);
    const matchedKeyword = keywords.find(key => question.toLowerCase().includes(key));
    return matchedKeyword ? responses[matchedKeyword] : "Thanks for your message! Could you please provide more details about your requirements?";
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <img 
          src={freelancer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}`}
          alt={freelancer.name}
          className={styles.chatAvatar}
        />
        <div className={styles.chatHeaderInfo}>
          <h3>{freelancer.name}</h3>
          <span className={styles.onlineStatus}>Online</span>
        </div>
        <button className={styles.closeChatButton} onClick={onClose}>×</button>
      </div>

      <div className={styles.chatMessages}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.sender === 'user' ? styles.userMessage : styles.freelancerMessage
            }`}
          >
            <div className={styles.messageContent}>
              {message.text}
              <span className={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {showSuggestions && (
        <div className={styles.suggestedMessages}>
          {suggestedMessages.map((msg, index) => (
            <button
              key={index}
              className={styles.suggestionChip}
              onClick={() => handleSend(msg)}
            >
              {msg}
            </button>
          ))}
        </div>
      )}

      <div className={styles.chatInput}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && newMessage && handleSend(newMessage)}
        />
        <button 
          className={styles.sendButton}
          onClick={() => newMessage && handleSend(newMessage)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
