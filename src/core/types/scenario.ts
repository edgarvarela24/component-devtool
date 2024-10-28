export interface BaseScenario<TProps> {
    name: string;
    props: TProps;
    description?: string;
  }
  
  export interface DevToolConfig {
    scenarios: BaseScenario<any>[];
    initialScenario?: string;
    onScenarioChange?: (scenario: BaseScenario<any>) => void;
  }