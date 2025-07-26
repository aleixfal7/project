import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Button from '../ui/Button';
import { useChat } from '../../hooks/useChat';

interface ChatWindowProps {
  sessionId?: string;
  onSessionCreate?: (sessionId: string) => void;
}

export default function ChatWindow({ sessionId, onSessionCreate }: ChatWindowProps) {
  const {
    session,
    messages,
    isLoading,
    sendMessage,
    generatePDF,
    isSendingMessage,
    isGeneratingPDF,
  } = useChat(sessionId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const canGeneratePDF = session?.status === 'completed' || 
    (session?.formData && Object.keys(session.formData).length > 0);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregant conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                Assistent de Tràmits
              </h2>
              <p className="text-sm text-gray-500">
                {session ? `Formulari: ${session.formType}` : 'Ajuntament de Tarragona'}
              </p>
            </div>
          </div>
          
          {canGeneratePDF && (
            <Button
              onClick={() => generatePDF()}
              isLoading={isGeneratingPDF}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descarregar PDF
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isSendingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={!sessionId || isSendingMessage}
        placeholder={sessionId ? 'Escriu la teva resposta...' : 'Selecciona un formulari per començar'}
      />
    </div>
  );
}