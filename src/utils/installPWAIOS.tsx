import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PWAPrompt from 'react-ios-pwa-prompt';

interface InstallPWAIOSModalProps {
  onClose: () => void;
}

const InstallPWAIOS: React.FC<InstallPWAIOSModalProps> = ({onClose}) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setIsIOS(true);
    }
  }, [])

  return (  
    <>
      {isIOS && (
        <>
          <PWAPrompt isShown={true} onClose={onClose}
          copyTitle={"Install Jokers of Neon App"}
          copyDescription={"For the best experience with Jokers of Neon, install the app to enjoy a more immersive and user-friendly interface."}
          appIconPath={"pwa-192x192.png"}
          />
        </>
      )}
    </>
    
  );
};

export default InstallPWAIOS;
