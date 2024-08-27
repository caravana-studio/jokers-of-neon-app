import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

const Particle = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 1000;
  mix-blend-mode: screen;
  filter: hue-rotate(60deg) sepia(1) saturate(5) brightness(1.2);
`;

interface GlowEffectProps {
    glow: boolean;
  }

const GlowEffect = styled.div<GlowEffectProps>`
  filter: ${(props) => (props.glow ? 'drop-shadow(0 0 20px yellow)' : 'none')};
  transition: filter 0.5s;
`;

const Container = styled.div`
  position: relative; 
  display: inline-block;
`;

interface OpenAnimationProps {
    children: React.ReactNode; 
  }

const OpenAnimation = ({ children }: OpenAnimationProps) => {
  const controls = useAnimation();
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);
  const [particle, setParticle] = useState<string | null>(null);

  useEffect(() => {
    setShake(true);
    setParticle('url(/vfx/particle1.gif)');

    const glowTimeout = setTimeout(() => {
      setShake(false);
      setGlow(true);
    }, 3000);

    const particle2Timeout = setTimeout(() => {
      setParticle('url(/vfx/explosion.gif)');
    }, 5000);

    const resetTimeout = setTimeout(() => {
      setGlow(false);
      setParticle(null);
    }, 7000);

    return () => {
      clearTimeout(glowTimeout);
      clearTimeout(particle2Timeout);
      clearTimeout(resetTimeout);
    };
  }, []);

  return (
    <motion.div
      animate={controls}
      initial={{ rotate: 0 }}
      transition={{ duration: 0.1, repeat: shake ? Infinity : 0, repeatType: 'reverse' }}
      onAnimationComplete={() => controls.stop()}
      style={{ position: 'relative', display: 'inline-block' }}
    >
        <Container>
            {particle && <Particle style={{ backgroundImage: particle }} />}
            <GlowEffect glow={glow}>{children}</GlowEffect>
        </Container>
      
    </motion.div>
  );
};

export default OpenAnimation;