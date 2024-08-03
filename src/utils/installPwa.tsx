import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PWAPrompt from 'react-ios-pwa-prompt';
import { usePWAInstall } from "react-use-pwa-install";

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false); // For PWAPrompt visibility
  const install = usePWAInstall();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setIsIOS(true);
    }
  }, [])

  const handleInstallIOS = () => {
    setShowPrompt(true);
  };

  return (  
    <>
    {install && (
        <Button onClick={install}>
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
