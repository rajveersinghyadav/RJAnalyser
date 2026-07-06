// 🧠 RJAnalyser - Memory Engine

const MemoryEngine = {

  // Save memory permanently
  save(key, value){
    let memory = JSON.parse(localStorage.getItem("rjanalyser_memory")) || {};
    memory[key] = value;
    localStorage.setItem("rjanalyser_memory", JSON.stringify(memory));
  },

  // Get memory
  get(key){
    let memory = JSON.parse(localStorage.getItem("rjanalyser_memory")) || {};
    return memory[key] || null;
  },

  // Delete specific memory
  delete(key){
    let memory = JSON.parse(localStorage.getItem("rjanalyser_memory")) || {};
    delete memory[key];
    localStorage.setItem("rjanalyser_memory", JSON.stringify(memory));
  },

  // Clear all memory
  clear(){
    localStorage.removeItem("rjanalyser_memory");
  },

  // Show all memory
  getAll(){
    return JSON.parse(localStorage.getItem("rjanalyser_memory")) || {};
  }

};
