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
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null); // Explicitly type ref

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleTouchStart = (event: any) => {
    console.log('[DraggableCard] Touch start', { id, hasOnCardHold: !!onCardHold });
    holdTimeout.current = setTimeout(() => {
      console.log('[DraggableCard] Hold timeout triggered', { id });
      onCardHold?.();
      holdTimeout.current = null;
    }, 200);
  };

  const handleTouchMove = () => {
    console.log('[DraggableCard] Touch move - cancelling hold', { id });
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current); // Cancel hold if movement detected
      holdTimeout.current = null;
    }
  };

  const handleTouchEnd = () => {
    console.log('[DraggableCard] Touch end', { id, hadTimeout: !!holdTimeout.current });
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current); // Clear timeout on touch end
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
