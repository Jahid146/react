/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CompilerError } from "../CompilerError";
import { GeneratedSource, HIRFunction } from "./HIR";
import { printTerminal } from "./PrintHIR";
import { mapTerminalSuccessors } from "./visitors";

export function assertTerminalSuccessorsExist(fn: HIRFunction): void {
  for (const [, block] of fn.body.blocks) {
    mapTerminalSuccessors(block.terminal, (successor) => {
      CompilerError.invariant(
        fn.body.blocks.has(successor),
        `Terminal successor references unknown block`,
        (block.terminal as any).loc ?? GeneratedSource,
        `Block bb${successor} does not exist for terminal '${printTerminal(
          block.terminal
        )}'`
      );
      return successor;
    });
  }
}
