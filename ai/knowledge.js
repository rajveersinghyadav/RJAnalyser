// 🧠 RJAnalyser - Knowledge Engine

const KnowledgeBase = {

  // Basic understanding layer
  intents: {
    greeting: ["hello", "hi", "hey"],
    name_query: ["what is my name", "my name"],
  },

  // Basic responses (starter knowledge)
  responses: {
    greeting: "Hello! I am RJAnalyser AI System.",
    unknown: "I am still learning... please teach me more."
  },

  // Function: detect intent
  detectIntent(input){
    input = input.toLowerCase();

    if(this.intents.greeting.some(word => input.includes(word))){
      return "greeting";
    }

    if(this.intents.name_query.some(word => input.includes(word))){
      return "name_query";
    }

    return "unknown";
  },

  // Function: get response
  getResponse(input){

    const intent = this.detectIntent(input);

    if(intent === "greeting"){
      return this.responses.greeting;
    }

    if(intent === "name_query"){
      return "Name will come from Memory Engine (next step).";
    }

    return this.responses.unknown;
  }

};
