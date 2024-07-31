import React, { useEffect, useState } from 'react';

// Define the BeforeInstallPromptEvent type if it's not available
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Cast the event as BeforeInstallPromptEvent
      const evt = event as BeforeInstallPromptEvent;
      evt.preventDefault();
      setDeferredPrompt(evt);
      setIsVisible(true); // Show your install button or banner here
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null); // Clear the prompt variable after user action
    setIsVisible(false); // Optionally hide the install button or banner
  };

  return (
    <div>
      {isVisible && (
        <button onClick={handleInstallClick}>
          Install App
        </button>
      )}
    </div>
  );
};

export default InstallPWA;
