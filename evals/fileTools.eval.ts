import { evaluate } from "@lmnr-ai/lmnr";
import { toolSelectionScore } from "./evaluators";
import type {EvalData , EvalTarget} from "./types.ts"
import dataSet from "./data/file-tools.json" with {type : "json"}
import {singleTurnExecuterWithMocks} from "./executors.ts"

const executor = async(data : EvalData) => singleTurnExecuterWithMocks(data)

evaluate({
  data : dataSet as any,
  executor,
  evaluators : {
    selectionScore : (output : any , expected : any) => {
      if(expected?.category === "secondary") return 1;
      return toolSelectionScore(output , expected)
    }
  },
  groupName : "files_tool_selection"
})