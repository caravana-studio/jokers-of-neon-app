import React, { useState, useEffect, useRef } from 'react';
import {
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { ProgressBar } from "../../components/CompactRoundData/ProgressBar";
import { BLUE } from '../../theme/colors';

export const CreatingGameDialog = ({
  isOpen = true,
  duration = 10000, // Default 10 seconds in milliseconds
  headingStages = [
    { text: "Creating game", showAt: 0 }
  ],
}) => {
  const [progress, setProgress] = useState(0);
  const [currentHeading, setCurrentHeading] = useState(headingStages[0]?.text || "Creating game");
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const slowPhaseStartedRef = useRef<boolean>(false);
  
  // Setup the animation loop
  useEffect(() => {
    if (isOpen) {
      // Initialize start time if not set
      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now();
      }
      
      // Animation function using requestAnimationFrame for smooth updates
      const updateProgress = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        
        // Calculate elapsed time
        const timeElapsed = timestamp - startTimeRef.current;
        setElapsedTime(timeElapsed);
        
        let newProgress: number;
        
        // Normal phase - before reaching duration and 95%
        if (timeElapsed <= duration && progress < 95) {
          // Calculate progress as a percentage of duration with natural curve
          const linearProgress = Math.min(timeElapsed / duration, 0.95);
          
          // Apply easing function for more natural progress
          newProgress = applyNaturalEasing(linearProgress) * 100;
        } 
        // Slow phase - after reaching 95% or exceeding duration, continue very slowly to 100%
        else {
          // Mark that we've entered the slow phase
          if (!slowPhaseStartedRef.current) {
            slowPhaseStartedRef.current = true;
          }
          
          // Very slow increments toward 100%
          // Use very small random increments (0.01% to 0.05% per frame)
          const slowIncrement = Math.random() * 0.04 + 0.01;
          newProgress = Math.min(99.9, progress + slowIncrement);
        }
        
        setProgress(newProgress);
        
        // Continue animation if not at 99.9% (essentially complete)
        if (newProgress < 99.9) {
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };
      
      // Start the animation
      animationFrameRef.current = requestAnimationFrame(updateProgress);
      
      // Cleanup function
      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isOpen, duration, progress]);
  
  // Apply a natural easing curve to make progress feel organic
  const applyNaturalEasing = (progress: number): number => {
    // Add small random variations (±2%) to create a jittery effect
    const jitter = Math.random() * 0.04 - 0.02;
    
    // Cubic bezier-like curve with added jitter
    if (progress < 0.2) {
      // Start fast
      return Math.min(1, Math.max(0, progress * 1.5 + jitter * progress));
    } else if (progress < 0.8) {
      // Slow down in the middle
      return Math.min(1, Math.max(0, 0.3 + (progress - 0.2) * 0.8 + jitter * (1 - progress)));
    } else {
      // Speed up slightly at the end
      return Math.min(0.95, Math.max(0, 0.78 + (progress - 0.8) * 0.85 + jitter * (1 - progress)));
    }
  };
  
  // Update heading based on elapsed time (not progress percentage)
  useEffect(() => {
    if (isOpen && headingStages.length > 0) {
      // Find the appropriate heading for the current time
      const stagesInReverse = [...headingStages].sort((a, b) => b.showAt - a.showAt);
      const currentStage = stagesInReverse.find(stage => elapsedTime >= stage.showAt);
      
      if (currentStage && currentStage.text !== currentHeading) {
        setCurrentHeading(currentStage.text);
      }
    }
  }, [elapsedTime, headingStages, isOpen, currentHeading]);
  
  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setElapsedTime(0);
      setCurrentHeading(headingStages[0]?.text || "Creating game");
      startTimeRef.current = null;
      slowPhaseStartedRef.current = false;
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isOpen, headingStages]);

  // Add animated ellipsis to the heading
  const [dots, setDots] = useState("...");
  
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev === "..." ? "." : prev === "." ? ".." : "...");
    }, 500);
    
    return () => clearInterval(dotsInterval);
  }, []);
  
  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="lg">
      <ModalOverlay 
      backdropFilter='blur(10px) ' />
      <ModalContent borderRadius={"20px"} boxShadow={`0px 0px 20px 15px ${BLUE}`} mt="35vh">
        <Flex p={6} w="100%" h="150px" justifyContent={"center"} flexDirection="column" gap={4}>
          <Heading size="sm" textAlign="center" h="40px" variant="italic">
            {currentHeading}{dots}
          </Heading>
          <ProgressBar progress={Math.round(progress)} />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default CreatingGameDialog;