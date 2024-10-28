import { BaseScenario, DevToolConfig } from '../types/scenario';
import { BaseMetrics } from '../types/metrics';

export class ScenarioManager<TProps> {
  private scenarios: Map<string, BaseScenario<TProps>>;
  private currentScenario: BaseScenario<TProps> | null;
  private metrics: BaseMetrics;
  private config: DevToolConfig;

  constructor(config: DevToolConfig) {
    this.scenarios = new Map();
    this.currentScenario = null;
    this.config = config;
    this.metrics = {
      renderTime: 0,
      updateCount: 0,
      lastUpdated: Date.now()
    };

    this.initializeScenarios(config.scenarios);
  }

  private initializeScenarios(scenarios: BaseScenario<TProps>[]): void {
    scenarios.forEach(scenario => {
      this.scenarios.set(scenario.name, scenario);
    });

    // Set initial scenario if specified, otherwise use first scenario
    if (this.config.initialScenario && this.scenarios.has(this.config.initialScenario)) {
      this.setCurrentScenario(this.config.initialScenario);
    } else if (scenarios.length > 0) {
      this.setCurrentScenario(scenarios[0].name);
    }
  }

  public getCurrentScenario(): BaseScenario<TProps> | null {
    return this.currentScenario;
  }

  public setCurrentScenario(scenarioName: string): boolean {
    const scenario = this.scenarios.get(scenarioName);
    if (!scenario) {
      return false;
    }

    this.currentScenario = scenario;
    this.updateMetrics();

    if (this.config.onScenarioChange) {
      this.config.onScenarioChange(scenario);
    }

    return true;
  }

  public getAllScenarios(): BaseScenario<TProps>[] {
    return Array.from(this.scenarios.values());
  }

  public getScenarioByName(name: string): BaseScenario<TProps> | undefined {
    return this.scenarios.get(name);
  }

  private updateMetrics(): void {
    this.metrics = {
      ...this.metrics,
      updateCount: this.metrics.updateCount + 1,
      lastUpdated: Date.now()
    };
  }

  public getMetrics(): BaseMetrics {
    return { ...this.metrics };
  }

  public updateRenderTime(renderTime: number): void {
    this.metrics = {
      ...this.metrics,
      renderTime
    };
  }
}