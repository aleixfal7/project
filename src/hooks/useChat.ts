import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../lib/api';
import { ChatSession, Message } from '../types';
import { generateId } from '../lib/utils';

export function useChat(sessionId?: string) {
  const queryClient = useQueryClient();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Get chat session
  const { data: session, isLoading } = useQuery({
    queryKey: ['chat-session', sessionId],
    queryFn: () => sessionId ? chatApi.getSession(sessionId) : null,
    enabled: !!sessionId,
  });

  // Create new session
  const createSessionMutation = useMutation({
    mutationFn: (formType: string) => chatApi.createSession(formType),
    onSuccess: (response) => {
      queryClient.setQueryData(['chat-session', response.data.id], response);
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) => {
      // Add user message immediately for better UX
      const userMessage: Message = {
        id: generateId(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
      };
      setLocalMessages(prev => [...prev, userMessage]);
      
      return chatApi.sendMessage(sessionId, message);
    },
    onSuccess: (response, variables) => {
      // Add bot response
      setLocalMessages(prev => [...prev, response.data]);
      
      // Update session in cache
      queryClient.invalidateQueries({ queryKey: ['chat-session', variables.sessionId] });
    },
    onError: () => {
      // Remove the optimistic user message on error
      setLocalMessages(prev => prev.slice(0, -1));
    },
  });

  // Generate PDF
  const generatePDFMutation = useMutation({
    mutationFn: (sessionId: string) => chatApi.generatePDF(sessionId),
  });

  const sendMessage = useCallback((message: string) => {
    if (!sessionId) return;
    sendMessageMutation.mutate({ sessionId, message });
  }, [sessionId, sendMessageMutation]);

  const createSession = useCallback((formType: string) => {
    return createSessionMutation.mutateAsync(formType);
  }, [createSessionMutation]);

  const generatePDF = useCallback(() => {
    if (!sessionId) return;
    return generatePDFMutation.mutateAsync(sessionId);
  }, [sessionId, generatePDFMutation]);

  // Combine server messages with local optimistic messages
  const allMessages = [
    ...(session?.data.messages || []),
    ...localMessages,
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    session: session?.data,
    messages: allMessages,
    isLoading,
    sendMessage,
    createSession,
    generatePDF,
    isCreatingSession: createSessionMutation.isPending,
    isSendingMessage: sendMessageMutation.isPending,
    isGeneratingPDF: generatePDFMutation.isPending,
  };
}