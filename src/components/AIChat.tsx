
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateDeepSeekContent } from '@/services/deepseekService';
import { ArchetypeDescription } from '@/types/numerology';
import { toast } from 'sonner';
import { SendIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  archetypes: ArchetypeDescription[];
}

export const AIChat = ({ archetypes }: AIChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Привет! Я твой помощник по нумерологии. Задай мне любой вопрос, и я помогу тебе разобраться в твоем нумерологическом профиле.' 
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call DeepSeek directly via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('deepseek', {
        body: {
          contentType: 'chat',
          archetypes,
          userMessage: userMessage.content
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }

      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.content || 'Извините, я не смог обработать ваш запрос.' 
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast.error('Не удалось получить ответ от ассистента');
      
      // Add error message to the chat
      setMessages((prev) => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto mb-4 space-y-4 max-h-[400px]">
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
            {message.content}
          </div>
        ))}
        {loading && (
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
          disabled={loading}
        />
        <Button 
          onClick={handleSend} 
          disabled={!input.trim() || loading}
          size="icon"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
