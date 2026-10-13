import type {
  EvalData,
  SingleTurnResult,
  MultiTurnEvalData,
  MultiTurnResult,
} from "./types.ts";

import { generateText , stepCountIs , tool, type ToolSet } from "ai";
import { openai } from "@ai-sdk/openai";
import {z} from "zod";
import { buildMessages } from "./utils.ts";

const TOOL_DEFINATION : any = {
  readFile : {
    description : "Read the content of the file at specified path",
    parameters : z.object({
      path : z.string().describe("the path to file that you need to read")
    })
  },
  writeFile : {
    description : "Write the content in the file at specified path",
    parameters : z.object({
      path : z.string().describe("the path to file that you need to write in"),
      content : z.string().describe("the content you want to write in the file")
    })
  },
  listFiles: {
    description : "list the file at specified path",
    parameters : z.object({
      path : z.string().describe("the path to folder that you need to list files from")
    })
  },
  deleteFile : {
    description : "delete  the file at specified path",
    parameters : z.object({
      path : z.string().describe("the path to file that you need to delete")
    })
  },
  runCommand : {
    description : "Execute the shell command and retuns its output",
    parameters : z.object({
      command : z.string().describe("the shell command to execute")
    })
  },
}

export const singleTurnExecuterWithMocks = async (data : EvalData) => {
  const messages = buildMessages(data)

  const tools : ToolSet = {}
  for(const toolName of data?.tools){
    const def = TOOL_DEFINATION[toolName]
    if(def) {
      tools[toolName] = tool({
        description : def.description,
        inputSchema : def.paramteres
      })
    }
  }

  const {toolCalls} = await generateText({
    model : openai(data?.config?.model ?? "gpt-5-mini"),
    messages,
    tools,
    stopWhen : stepCountIs(1),
    temperature : data?.config?.temperature ?? undefined
  })

  const calls = toolCalls?.map(tc => ({
    toolName : tc?.toolName,
    args : "args" in tc ? tc?.args : {}
  }))

  const toolNames = toolCalls?.map(tc => tc?.toolName)

  return {
    toolCalls,
    calls,
    toolNames,
    selectedAny : toolNames?.length > 0
  }
}