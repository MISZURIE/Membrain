import { useEffect, useRef } from 'react';
// D3 import — the visualization will be built here
// import * as d3 from 'd3';

/**
 * MemoryTree — D3.js radial tree visualization of memory nodes.
 * Color-coded by TID importance score (heat map gradient).
 */

interface MemoryNode {
  id: string;
  content: string;
  tidScore: number;
  children?: MemoryNode[];
}

interface MemoryTreeProps {
  data: MemoryNode | null;
  onNodeClick?: (node: MemoryNode) => void;
}

export default function MemoryTree({ data, onNodeClick }: MemoryTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // TODO: Implement D3.js radial tree layout
    // const svg = d3.select(svgRef.current);
    // ... D3 tree rendering logic

  }, [data]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {data ? (
        <svg ref={svgRef} className="w-full h-full" />
      ) : (
        <div className="text-center text-gray-500 space-y-2">
          <div className="text-4xl">🌳</div>
          <p className="font-medium">Memory Tree</p>
          <p className="text-xs">D3.js radial tree will render here once memories exist</p>
        </div>
      )}
    </div>
  );
}
