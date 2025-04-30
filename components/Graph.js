'use client'
import React, { useRef, useEffect } from 'react';
import Viva from 'vivagraphjs';


function MyGraph({graphs = [], springLength, springCoeff, dragCoeff, gravity}) {
  const graphRef = useRef(null);
  
  useEffect(() => {
    const renderers = [];
    const element = graphRef.current;
    graphs.forEach(gr => {
      const graph = Viva.Graph.graph();
      Object.keys(gr.vertices).forEach((key) => {
        graph.addNode(Number(key))
      })
      for (let key in gr.vertices) {
        gr.vertices[key].forEach((ver) => {
          graph.addLink(Number(key), ver)
        })
      }
      const layout = Viva.Graph.Layout.forceDirected(graph, {
        springLength : springLength,
        springCoeff : springCoeff,
        dragCoeff : dragCoeff,
        gravity : gravity
      });
      const renderer = Viva.Graph.View.renderer(graph, {
          container: element,
          layout: layout
      });
      renderers.push(renderer);
      renderer.run();
    })
    

    return () => {
      renderers.forEach((renderer => renderer.dispose()))      
    };
  }, [graphs]); 

  return (
    <div className='canvas' ref={graphRef} id="graphDiv" />
  );
}

export default MyGraph;