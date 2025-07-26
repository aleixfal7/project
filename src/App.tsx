import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FormSelector from './components/forms/FormSelector';
import ChatWindow from './components/chat/ChatWindow';
import { useChat } from './hooks/useChat';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const { createSession, isCreatingSession } = useChat();

  const handleSelectForm = async (formType: string) => {
    try {
      const response = await createSession(formType);
      setCurrentSessionId(response.data.id);
    } catch (error) {
      console.error('Error creating session:', error);
      // In a real app, you'd show an error toast here
    }
  };

  const handleBackToSelector = () => {
    setCurrentSessionId(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        {currentSessionId ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-2">
              <button
                onClick={handleBackToSelector}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                ← Tornar a la selecció de formularis
              </button>
            </div>
            <ChatWindow 
              sessionId={currentSessionId}
              onSessionCreate={setCurrentSessionId}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-12">
            <FormSelector 
              onSelectForm={handleSelectForm}
              isLoading={isCreatingSession}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}