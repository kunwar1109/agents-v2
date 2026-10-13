import "dotenv/config"
import { generateText, type ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { tools } from "./tools/index.ts";
import { SYSTEM_PROMPT } from "./system/prompt.ts";
import {getTracer , Laminar} from "@lmnr-ai/lmnr"
import type { AgentCallbacks } from "../types.ts";
import { executeTool } from "./executeTool.ts";

const MODEL_NAME = "gpt-5-mini";

console.log(!!process.env.LMNR_PROJECT_API_KEY)

Laminar.initialize({
  projectApiKey : process.env.LMNR_PROJECT_API_KEY
})

export async function runAgent(
  userMessage: string,
  conversationHistory?: ModelMessage[],
  callbacks?: AgentCallbacks,
): Promise<any> {
  const { text  } = await generateText({
    model: openai(MODEL_NAME),
    prompt: userMessage,
    system: SYSTEM_PROMPT,
    tools,
    experimental_telemetry : {
      isEnabled : true,
      tracer : getTracer()
    }
  });

  // async function runTools () {
  //   for(const toolCall of toolCalls){
  //     console.log(await executeTool(toolCall?.toolName , toolCall?.input))
  //   }
  // }

  // await runTools()
console.log(text)
  
}

await runAgent(
  "who is highest wicket taker in historhy of cricket ?" 
)

