// 🧠 RJAnalyser - REAL AI BRAIN ENGINE

const Brain = {

  process(input){

    if(!input) return "No input received";

    input = input.toLowerCase();

    // 1. Check Memory first
    let rememberedName = MemoryEngine.get("name");

    // 2. Knowledge base response
    let knowledgeResponse = KnowledgeBase.getResponse(input);

    // 3. Name saving logic
    if(input.includes("my name is")){
      let name = input.split("my name is")[1].trim();
      MemoryEngine.save("name", name);
      return "🧠 Got it! I will remember your name " + name;
    }

    // 4. Name recall
    if(input.includes("what is my name")){
      if(rememberedName){
        return "🧠 Your name is " + rememberedName;
      } else {
        return "🧠 I don't know your name yet. Tell me!";
      }
    }

    // 5. Greeting override
    if(input.includes("hello") || input.includes("hi")){
      return "👋 Hello! I am RJAnalyser Brain. How can I help you?";
    }

    // 6. If knowledge has answer
    if(knowledgeResponse && knowledgeResponse !== "unknown"){
      return knowledgeResponse;
    }

    // 7. Default fallback (learning mode)
    return "🧠 I am analyzing your input... I will learn from this.";
  }

};
