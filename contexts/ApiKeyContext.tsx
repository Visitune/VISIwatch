import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  removeApiKey: () => void;
  isConfigured: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    // Récupération depuis le SessionStorage au chargement (persiste au refresh, s'efface à la fermeture)
    const storedKey = sessionStorage.getItem('GEMINI_API_KEY');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    if (key && key.trim().length > 0) {
      sessionStorage.setItem('GEMINI_API_KEY', key.trim());
      setApiKeyState(key.trim());
    }
  };

  const removeApiKey = () => {
    sessionStorage.removeItem('GEMINI_API_KEY');
    setApiKeyState(null);
  };

  return (
    <ApiKeyContext.Provider value={{ 
      apiKey, 
      setApiKey, 
      removeApiKey, 
      isConfigured: !!apiKey 
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};