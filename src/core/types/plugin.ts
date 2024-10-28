import { BaseMetrics } from "./metrics";
import { BaseScenario } from "./scenario";

export interface DevToolPlugin {
    name: string;
    initialize: () => void;
    onScenarioChange?: (scenario: BaseScenario<any>) => void;
    onMetricsUpdate?: (metrics: BaseMetrics) => void;
  }