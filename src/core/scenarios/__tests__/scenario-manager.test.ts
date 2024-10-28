import { ScenarioManager } from '../scenario-manager';
import { BaseScenario, DevToolConfig } from '../../types/scenario';

interface TestProps {
  name: string;
  value: number;
}

describe('ScenarioManager', () => {
  let testScenarios: BaseScenario<TestProps>[];
  let config: DevToolConfig;
  let manager: ScenarioManager<TestProps>;

  beforeEach(() => {
    testScenarios = [
      {
        name: 'scenario1',
        props: { name: 'test1', value: 1 },
        description: 'First test scenario'
      },
      {
        name: 'scenario2',
        props: { name: 'test2', value: 2 },
        description: 'Second test scenario'
      }
    ];

    config = {
      scenarios: testScenarios
    };

    manager = new ScenarioManager<TestProps>(config);
  });

  describe('initialization', () => {
    it('should initialize with the first scenario as default', () => {
      expect(manager.getCurrentScenario()).toEqual(testScenarios[0]);
    });

    it('should initialize with specified initial scenario', () => {
      const configWithInitial: DevToolConfig = {
        scenarios: testScenarios,
        initialScenario: 'scenario2'
      };
      const managerWithInitial = new ScenarioManager<TestProps>(configWithInitial);
      expect(managerWithInitial.getCurrentScenario()).toEqual(testScenarios[1]);
    });

    it('should handle empty scenarios array', () => {
      const emptyManager = new ScenarioManager<TestProps>({ scenarios: [] });
      expect(emptyManager.getCurrentScenario()).toBeNull();
    });
  });

  describe('scenario management', () => {
    it('should return all scenarios', () => {
      expect(manager.getAllScenarios()).toEqual(testScenarios);
    });

    it('should get scenario by name', () => {
      expect(manager.getScenarioByName('scenario1')).toEqual(testScenarios[0]);
    });

    it('should return undefined for non-existent scenario', () => {
      expect(manager.getScenarioByName('nonexistent')).toBeUndefined();
    });

    it('should switch scenarios', () => {
      expect(manager.setCurrentScenario('scenario2')).toBe(true);
      expect(manager.getCurrentScenario()).toEqual(testScenarios[1]);
    });

    it('should return false when switching to non-existent scenario', () => {
      expect(manager.setCurrentScenario('nonexistent')).toBe(false);
      expect(manager.getCurrentScenario()).toEqual(testScenarios[0]); // maintains previous scenario
    });
  });

  describe('metrics tracking', () => {
    it('should update metrics when switching scenarios', () => {
      const initialMetrics = manager.getMetrics();
      manager.setCurrentScenario('scenario2');
      const updatedMetrics = manager.getMetrics();
      
      expect(updatedMetrics.updateCount).toBe(initialMetrics.updateCount + 1);
      expect(updatedMetrics.lastUpdated).toBeGreaterThan(initialMetrics.lastUpdated);
    });

    it('should update render time', () => {
      const renderTime = 100;
      manager.updateRenderTime(renderTime);
      expect(manager.getMetrics().renderTime).toBe(renderTime);
    });
  });

  describe('callbacks', () => {
    it('should call onScenarioChange when switching scenarios', () => {
      const onScenarioChange = jest.fn();
      const configWithCallback = {
        scenarios: testScenarios,
        onScenarioChange
      };
      
      const managerWithCallback = new ScenarioManager<TestProps>(configWithCallback);
      managerWithCallback.setCurrentScenario('scenario2');
      
      expect(onScenarioChange).toHaveBeenCalledWith(testScenarios[1]);
    });
  });
});