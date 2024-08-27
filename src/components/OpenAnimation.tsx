import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

const Particle = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: -1;
`;

interface GlowEffectProps {
    glow: boolean;
  }

const GlowEffect = styled.div<GlowEffectProps>`
  filter: ${(props) => (props.glow ? 'drop-shadow(0 0 20px yellow)' : 'none')};
  transition: filter 0.5s;
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
      <GlowEffect glow={glow}>{children}</GlowEffect>
      {particle && <Particle style={{ backgroundImage: particle }} />}
    </motion.div>
  );
};

export default OpenAnimation;