import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

const Particle = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1000;
  mix-blend-mode: screen;
  filter: sepia(1) saturate(0) brightness(1);
`;

interface GlowEffectProps {
    glow: boolean;
  }

const GlowEffect = styled.div<GlowEffectProps>`
  filter: ${(props) => (props.glow ? 'drop-shadow(0 0 20px white)' : 'none')};
  transition: filter 0.5s;
  z-index: 1500;
`;

const Container = styled.div`
  position: relative; 
  display: inline-block;
`;

const ChildrenWrapper = styled.div<{ hide: boolean }>`
  visibility: ${(props) => (props.hide ? 'hidden' : 'visible')};
  position: relative; 
`;

interface OpenAnimationProps {
    children: React.ReactNode; 
  }

const OpenAnimation = ({ children }: OpenAnimationProps) => {
  const controls = useAnimation();
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);
  const [particle, setParticle] = useState<string | null>(null);
  const [hideChildren, setHideChildren] = useState(false);

  useEffect(() => {
    setShake(true);
    setParticle('url(/vfx/particle2.gif)');

    const glowTimeout = setTimeout(() => {
      setShake(false);
      setGlow(true);
      setParticle('url(/vfx/glow_particle.gif)');
    }, 500);

    const particle2Timeout = setTimeout(() => {
        setHideChildren(true);
        setParticle('url(/vfx/explosion3.gif)');
    }, 1500);

    const resetTimeout = setTimeout(() => {
      setParticle(null);
      setHideChildren(false);
      setGlow(false);
    }, 2200);

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
            <GlowEffect glow={glow}>
                <ChildrenWrapper hide={hideChildren}>
                    {children}
                </ChildrenWrapper>
            </GlowEffect>
        </Container>
      
    </motion.div>
  );
};

export default OpenAnimation;