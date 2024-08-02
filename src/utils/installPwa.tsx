import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PWAPrompt from 'react-ios-pwa-prompt';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false); // For PWAPrompt visibility

  
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Detect if it's a mobile device
    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setIsIOS(true);
    }
  }, [])

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallAndroid = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleInstallIOS = () => {
    setShowPrompt(true);
  };

  return (  
    <>
    {isAndroid && (
        <Button onClick={handleInstallAndroid}>
          INSTALL APP
        </Button>
      )}
      {isIOS && (
        <>
          <Button onClick={handleInstallIOS}>
            INSTALL APP
          </Button>
          {showPrompt && <PWAPrompt isShown={true} onClose={() => setShowPrompt(false)}
          copyTitle={"Install Jokers of Neon App"}
          copyDescription={"For the best experience with Jokers of Neon, install the app to enjoy a more immersive and user-friendly interface."}
          appIconPath={"pwa-192x192.png"}
          />}
          
        </>
      )}
    </>
    
  );
};

export default InstallPWA;
