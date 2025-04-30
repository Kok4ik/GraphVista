'use client'
import DraggableText from "@/components/DraggableText";
import MyGraph from "@/components/Graph";
import Graph from "@/components/GraphClass";
import Modal from "@/components/Modal";
import { useState, useEffect } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [graphs, setGraphs] = useState([]);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [selectedVertices, setSelectedVertices] = useState({ from: null, to: null });
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const [isModalActions, setIsModalActions] = useState(false);
  const [texts, setTexts] = useState([]);
  const [isSettingsModal, setIsSettingsModal] = useState(false);
  const [springCoeff, setSpringCoeff] = useState(0.0008);
  const [springLength, setSpringLength] = useState(30);
  const [dragCoeff, setDragCoeff] = useState(0.02);
  const [gravity, setGravity] = useState(-1.2);


  useEffect(() => {
    setCurrentGraph(new Graph());
  }, []);

  const getAllGraphsStats = () => {
    let totalVertices = 0;
    let totalEdges = 0;

    graphs.forEach(graph => {
      const vertices = Object.keys(graph.vertices);
      totalVertices += vertices.length;

      const addedEdges = new Set();
      for (const [vertex, neighbors] of Object.entries(graph.vertices)) {
        for (const neighbor of neighbors) {
          const edgeKey = `${vertex}-${neighbor}`;
          const reverseKey = `${neighbor}-${vertex}`;
          if (!addedEdges.has(reverseKey)) {
            totalEdges++;
            addedEdges.add(edgeKey);
          }
        }
      }
    });

    return { totalVertices, totalEdges };
  };

  const getCurrentGraphStats = () => {
    if (!currentGraph) return { vertices: 0, edges: 0 };

    const vertices = Object.keys(currentGraph.vertices);
    let edges = 0;
    const addedEdges = new Set();

    for (const [vertex, neighbors] of Object.entries(currentGraph.vertices)) {
      for (const neighbor of neighbors) {
        const edgeKey = `${vertex}-${neighbor}`;
        const reverseKey = `${neighbor}-${vertex}`;
        if (!addedEdges.has(reverseKey)) {
          edges++;
          addedEdges.add(edgeKey);
        }
      }
    }

    return { vertices: vertices.length, edges };
  };

  const { totalVertices, totalEdges } = getAllGraphsStats();
  const { vertices: currentVertices, edges: currentEdges } = getCurrentGraphStats();

  const getEdgesList = () => {
    if (!currentGraph?.vertices) return [];
    
    const edges = [];
    const addedEdges = new Set();

    for (const [vertex, neighbors] of Object.entries(currentGraph.vertices)) {
      for (const neighbor of neighbors) {
        const edgeKey = `${vertex}-${neighbor}`;
        const reverseKey = `${neighbor}-${vertex}`;
        if (!addedEdges.has(reverseKey)) {
          edges.push({
            from: vertex,
            to: neighbor,
            key: edgeKey
          });
          addedEdges.add(edgeKey);
        }
      }
    }

    return edges;
  };

  const getVerticesList = () => {
    return currentGraph?.vertices ? Object.keys(currentGraph.vertices) : [];
  };

  function AddGraph() {
    if (!currentGraph) return;
    setGraphs([...graphs, currentGraph]);
    setCurrentGraph(new Graph());
    setIsModalOpen(false);
    setSelectedVertices({ from: null, to: null });
    setActions([...actions, `граф ${graphs.length + 1} создан.`]);
  }

  function startAddGraph() {
    setCurrentGraph(new Graph());
    setIsModalOpen(true);
  }

  const addVertex = () => {
    if (!currentGraph) return;
    
    const newGraph = new Graph();
    Object.assign(newGraph, currentGraph);
    const vertexId = getVerticesList().length + 1;
    newGraph.addVertex(vertexId.toString());
    setCurrentGraph(newGraph);
  };

  const addEdge = () => {
    if (!currentGraph || !selectedVertices.from || !selectedVertices.to) return;
    
    try {
      const newGraph = new Graph();
      Object.assign(newGraph, currentGraph);
      newGraph.addEdge(selectedVertices.from, selectedVertices.to);
      setCurrentGraph(newGraph);
      setSelectedVertices({ from: null, to: null });
    } catch (error) {
      alert(error.message);
    }
  };

  const selectVertex = (vertexId) => {
    if (selectedVertices.from === null) {
      setSelectedVertices({ ...selectedVertices, from: vertexId });
    } 
    else if (selectedVertices.to === null && vertexId !== selectedVertices.from) {
      setSelectedVertices({ ...selectedVertices, to: vertexId });
    }
    else {
      setSelectedVertices({ from: vertexId, to: null });
    }
  };
  function deleteGraph(i) {
    setIsModalDeleteOpen(false);
    graphs[i] = graphs[graphs.length - 1];
    graphs.pop();
    setGraphs([...graphs]);
    setActions([...actions, `граф ${i + 1} удалён.`])
  }
  function addText() {
    setTexts([...texts, "Введите текст..."]);
    setActions([...actions, "добавлен текст."]);
  }
  return (
    <div style={{display: 'flex'}}>
      <div className="menu">
        <div style={{display: 'block'}}>               
          <button className="menu" onClick={startAddGraph}>
            Создать граф
          </button>
          <button 
          className="menu"
          onClick={addText}
          >Добавить текст</button>
          <button className="menu" onClick={() => setIsModalDeleteOpen(true)}>Удалить граф</button>
          <button className="menu" onClick={() => setIsModalActions(true)}>Действия</button>
          <button className="menu">Алгоритмы</button>
          <button className="menu" onClick={() => setIsSettingsModal(true)}>Настройки</button>
          <button className="menu">Инструкция</button>
        </div>
        <div style={{display: 'block', marginTop: 'auto'}}>
          <p>Текущий граф: {currentVertices} вершин, {currentEdges} рёбер</p>
          <p>Всего графов: {graphs.length}</p>
          <p>Всего вершин: {totalVertices}</p>
          <p>Всего рёбер: {totalEdges}</p>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Создать новый граф</h2>
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <button onClick={addVertex}>Добавить вершину</button>
          <button 
            onClick={addEdge}
            disabled={!selectedVertices.from || !selectedVertices.to}
          >
            Добавить ребро
          </button>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div>
            <h3>Вершины ({currentVertices}):</h3>
            {getVerticesList().length === 0 ? (
              <p>Нет вершин</p>
            ) : (
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {getVerticesList().map(vertexId => (
                  <button
                    key={vertexId}
                    onClick={() => selectVertex(vertexId)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: 
                        selectedVertices.from === vertexId ? 'blue' :
                        selectedVertices.to === vertexId ? 'green' : 'lightgray',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {vertexId}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3>Рёбра ({currentEdges}):</h3>
            {getEdgesList().length === 0 ? (
              <p>Нет рёбер</p>
            ) : (
              <ul style={{
                listStyleType: 'none',
                padding: 0,
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #eee',
                padding: '10px'
              }}>
                {getEdgesList().map(edge => (
                  <li 
                    key={edge.key}
                    style={{
                      padding: '8px',
                      margin: '5px 0',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px'
                    }}
                  >
                    {edge.from} ↔ {edge.to}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button 
          onClick={AddGraph}
          style={{marginTop: '20px', padding: '10px 20px'}}
        >
          Сохранить граф
        </button>
      </Modal>     
      <Modal isOpen={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)}>
          <h3>Графы:</h3>
          <div style={{marginTop: 30}} >
            {graphs.length != 0 
            ? graphs.map((_, i) => 
            <><div style={{display: 'flex', marginBottom: 10}}>
              <h4>Граф {i + 1}</h4>
              <button onClick={() => deleteGraph(i)}>Удалить</button>
            </div></>)
            : <h4>Список графов пуст</h4>
            }
          </div>
      </Modal>
      <Modal isOpen={isModalActions} onClose={() => setIsModalActions(false)}>
        {actions.length !== 0
        ? actions.map((act, i) => 
          <h4 key={i}>Действие {i + 1}: {act}</h4>
        )
        : <h4>Действий нет</h4>
        }
        <button style={{marginTop: '20px', padding: '10px 20px'}} onClick={() => setIsModalActions(false)}>
          Закрыть
        </button>
      </Modal>
      <Modal isOpen={isSettingsModal} onClose={() => setIsSettingsModal(false)}>
        <div>
          <h4>SpringCoeff: </h4>
          <input
          type="number"
          value={springCoeff}
          onChange={e => setSpringCoeff(e.target.value)}
          />
        </div>
        <div>
          <h4>SpringLength: </h4>
          <input
          type="number"
          value={springLength}
          onChange={e => setSpringLength(e.target.value)}
          />
        </div>
        <div>
          <h4>Gravity: </h4>
          <input
          type="number"
          value={gravity}
          onChange={e => setGravity(e.target.value)}
          />
        </div>
        <div>
          <h4>DragCoeff: </h4>
          <input
          type="number"
          value={dragCoeff}
          onChange={e => setDragCoeff(e.target.value)}
          />
        </div>
      </Modal>
        {texts.map((t, i) => 
          <DraggableText initialText={t} key={i}/>
        )}
      <MyGraph graphs={graphs} springCoeff={springCoeff} springLength={springLength} dragCoeff={dragCoeff} gravity={gravity}/>    
    </div>
  );
}