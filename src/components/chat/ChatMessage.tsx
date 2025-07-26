import { motion } from 'framer-motion';
import { Message } from '../../types';
import { formatDate } from '../../lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-sm lg:max-w-md ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isBot
              ? 'bg-white border border-gray-200 text-gray-900'
              : 'bg-blue-600 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <div className={`mt-1 px-2 ${isBot ? 'text-left' : 'text-right'}`}>
          <span className="text-xs text-gray-500">
            {formatDate(message.timestamp)}
          </span>
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center order-2">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}