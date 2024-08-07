import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { usePWAInstall } from "react-use-pwa-install";
import InstallPromptModal from './InstallPromptModal';

interface InstallPromptModalProps {
  onClose: () => void;
}

const InstallPWAAndroid: React.FC<InstallPromptModalProps> = ({onClose}) => {
  const [isModalOpen, setModalOpen] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const install = usePWAInstall();
  const navigate = useNavigate();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setIsIOS(true);
    }

    if (!install || isIOS) {
      navigate("/login");
    }

  }, [install, navigate])

  const handleClose = () => {
    setModalOpen(false);
    onClose();
  };

  return (  
    <>
    {install && (
        <InstallPromptModal isOpen={isModalOpen} 
          onClose={handleClose} onInstall={install} onPlayInBrowser={() => {navigate("/login");}}
        />
    )}
    </>
    
  );
};

export default InstallPWAAndroid;
