import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

const Particle = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: contain;
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

const ExplosionEffect = styled.img<{ scale: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background={}
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center; 
  z-index: 9999999;
  transform: translate(-50%, -50%) scale(${(props) => props.scale});
`;

const ShakeEffect = motion.div; 

interface OpenAnimationProps {
    children: React.ReactNode; 
    startAnimation: boolean;
    onAnimationEnd?: () => void;
  }

const OpenAnimation = ({ children, startAnimation, onAnimationEnd }: OpenAnimationProps) => {
  const controls = useAnimation();
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const [explosionScale, setExplosionScale] = useState(0);
  const [particle, setParticle] = useState<string | null>(null);

  useEffect(() => {
    if (startAnimation)
        {
            setParticle('url(/vfx/particle2.gif)');

            const glowTimeout = setTimeout(() => {
                setShake(true);
                setGlow(true);
                setParticle('url(/vfx/glow_particle.gif)');
            }, 500);

            const particle2Timeout = setTimeout(() => {
              setExplosion(true);
              setExplosionScale(0.1); 
              let currentScale = 0.1;
      
              const scaleInterval = setInterval(() => {
                currentScale += 0.1; 
                if (currentScale >= 10) { 
                  clearInterval(scaleInterval);
                } else {
                  setExplosionScale(currentScale);
                }
              }, 1);
      
              return () => {
                clearInterval(scaleInterval);
              };
            }, 1500);

            const resetTimeout = setTimeout(() => {
                setParticle(null);
                setShake(false);
                setGlow(false);
                setExplosion(false);
                
                if (onAnimationEnd) onAnimationEnd();
            }, 2200);

            return () => {
                clearTimeout(glowTimeout);
                clearTimeout(particle2Timeout);
                clearTimeout(resetTimeout);
            };
        }
  }, [startAnimation, onAnimationEnd]);

  return (
    <motion.div
      animate={controls}
      initial={{ rotate: 0 }}
      transition={{ duration: 0.1, repeat: shake ? Infinity : 0, repeatType: 'reverse' }}
      onAnimationComplete={() => controls.stop()}
      style={{ position: 'relative', display: 'inline-block' }}
    >
        {particle && <Particle style={{ backgroundImage: particle }} />}
        <Container>
        <ExplosionEffect scale={explosionScale} src={explosion ? "/vfx/explosion_blue.gif" : ""}></ExplosionEffect>           
            <GlowEffect glow={glow}>
                <ShakeEffect 
                    animate={shake ? { rotate: [0, -5, 5, 0] } : { rotate: 0 }} 
                    transition={{ duration: 0.3, repeat: shake ? Infinity : 0, repeatType: 'reverse' }}
                >
                    {children}
                </ShakeEffect>
            </GlowEffect>
        </Container>   
    </motion.div>
  );
};

export default OpenAnimation;