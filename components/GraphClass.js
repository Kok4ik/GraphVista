export default class Graph {
    constructor() {
      this.vertices = {}; 
    }
    
    addVertex(value) {
      if (!this.vertices[value]) {
        this.vertices[value] = [];
      }
    }
    
    addEdge(vertex1, vertex2) {
      if (!(vertex1 in this.vertices) || !(vertex2 in this.vertices)) {
        throw new Error('В графе нет таких вершин');
      }
  
      if (!this.vertices[vertex1].includes(vertex2)) {
        this.vertices[vertex1].push(vertex2);
      }
      if (!this.vertices[vertex2].includes(vertex1)) {
        this.vertices[vertex2].push(vertex1);
      }
    }
  }