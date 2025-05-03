
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArchetypeDescription } from '@/types/numerology';
import { toast } from 'sonner';
import { SendIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  generateDeepSeekContent, 
  saveChatMessage, 
  getChatMessages 
} from '@/services/deepseekService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  archetypes: ArchetypeDescription[];
  calculationId: string;
}

export const AIChat = ({ archetypes, calculationId }: AIChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load existing chat messages on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const chatHistory = await getChatMessages(calculationId);
        
        if (chatHistory && chatHistory.length > 0) {
          setMessages(chatHistory);
        } else {
          // If no chat history, add initial welcome message
          const welcomeMessage = { 
            role: 'assistant' as const, 
            content: 'Привет! Я твой помощник по нумерологии. Задай мне любой вопрос, и я помогу тебе разобраться в твоем нумерологическом профиле.' 
          };
          setMessages([welcomeMessage]);
          // Save the welcome message to the database
          await saveChatMessage(calculationId, 'assistant', welcomeMessage.content);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast.error('Не удалось загрузить историю чата');
      } finally {
        setLoading(false);
      }
    };
    
    if (calculationId) {
      loadChatHistory();
    }
  }, [calculationId]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || submitting) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSubmitting(true);

    try {
      // Save user message
      await saveChatMessage(calculationId, 'user', userMessage.content);
      
      // Generate AI response
      const response = await generateDeepSeekContent('chat', archetypes, userMessage.content);
      
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: response.content
      };
      
      // Save assistant message
      await saveChatMessage(calculationId, 'assistant', assistantMessage.content);
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast.error('Не удалось получить ответ от ассистента');
      
      // Add error message to the chat
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // Save error message
      await saveChatMessage(calculationId, 'assistant', errorMessage.content);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      line ? <p key={i} className="mb-1">{line}</p> : <br key={i} />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
        <span>Загрузка чата...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div 
        id="chat-messages-container"
        className="flex-grow overflow-auto mb-4 space-y-4 max-h-[400px] min-h-[300px]"
      >
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg p-3 max-w-[80%] break-words",
              message.role === 'user' 
                ? "ml-auto bg-numerica text-white" 
                : "mr-auto bg-muted"
            )}
          >
            {formatMessage(message.content)}
          </div>
        ))}
        {submitting && (
          <div className="mr-auto bg-muted rounded-lg p-3">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-numerica/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-numerica/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-numerica/60 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Задайте вопрос..."
          className="resize-none"
          disabled={submitting}
        />
        <Button 
          onClick={handleSend} 
          disabled={!input.trim() || submitting}
          size="icon"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
