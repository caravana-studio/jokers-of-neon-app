import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

export interface IDraggableCardProps {
  id: string;
  children: JSX.Element;
  onCardHold?: () => void;
}

export const DraggableCard = ({
  id,
  children,
  onCardHold,
}: IDraggableCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdActivated = useRef<boolean>(false); // Track if hold was activated

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleTouchStart = (event: any) => {
    holdActivated.current = false; // Reset on new touch
    holdTimeout.current = setTimeout(() => {
      console.log('[DraggableCard] Hold timeout triggered', { id });
      holdActivated.current = true; // Mark as activated
      onCardHold?.();
      holdTimeout.current = null;
    }, 200);
  };

  const handleTouchMove = () => {
    console.log('[DraggableCard] Touch move', { id, holdActivated: holdActivated.current });
    // Only cancel if hold hasn't been activated yet
    if (holdTimeout.current && !holdActivated.current) {
      console.log('[DraggableCard] Cancelling hold due to movement');
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  const handleTouchEnd = () => {
    console.log('[DraggableCard] Touch end', { id, hadTimeout: !!holdTimeout.current, holdActivated: holdActivated.current });
    // Only cancel if hold hasn't been activated yet
    if (holdTimeout.current && !holdActivated.current) {
      console.log('[DraggableCard] Cancelling hold on touch end');
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};
