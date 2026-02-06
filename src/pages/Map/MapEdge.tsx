import { memo } from "react";
import { BaseEdge, EdgeProps, Position, getBezierPath } from "reactflow";

const MapEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    markerStart,
    style = {},
    data,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    curvature: 0.25,
  });

  const shouldPulse = Boolean(data?.shouldPulse);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={{
          strokeLinecap: "round",
          ...style,
        }}
      />
      {shouldPulse && (
        <path
          d={edgePath}
          pathLength={1}
          stroke="#fff"
          strokeWidth={1}
          fill="none"
          className="map-edge__pulse-layer"
          pointerEvents="none"
        />
      )}
    </>
  );
});

export default MapEdge;
