/**
 * PPA Market AI Skill - Test Suite
 * Tests the core functionality of the PPAMarketSkill class
 */

import { PPAMarketSkill } from '../skills/ppa-skill';

describe('PPAMarketSkill', () => {
  let skill: PPAMarketSkill;

  beforeAll(() => {
    // Initialize skill with mock credentials
    skill = new PPAMarketSkill({
      apiKey: 'mock-api-key',
      secretKey: 'mock-secret-key',
      passphrase: 'mock-passphrase',
      rpcUrl: 'https://xlayerrpc.okx.com',
      chainId: 196,
    });
  });

  describe('Intent Parsing', () => {
    test('should recognize buy intent', async () => {
      const responses = [
        await skill.handleMessage('购买 100 个 yes token'),
        await skill.handleMessage('买入 50 个 no token'),
        await skill.handleMessage('支付 $PCT 购买 200 个 yes token'),
      ];

      responses.forEach(response => {
        expect(response).toContain('购买确认');
        expect(response).toContain('风险提示');
      });
    });

    test('should recognize sell intent', async () => {
      const responses = [
        await skill.handleMessage('出售所有 token'),
        await skill.handleMessage('卖出 50% 的持仓'),
        await skill.handleMessage('平仓'),
      ];

      responses.forEach(response => {
        expect(response).toContain('卖出确认');
      });
    });

    test('should recognize market info intent', async () => {
      const responses = [
        await skill.handleMessage('查看市场信息'),
        await skill.handleMessage('显示所有市场'),
        await skill.handleMessage('market info'),
      ];

      responses.forEach(response => {
        expect(response).toContain('BTC 2026');
        expect(response).toContain('截止时间');
      });
    });

    test('should recognize approve intent', async () => {
      const responses = [
        await skill.handleMessage('批准 PCT'),
        await skill.handleMessage('approve PCT'),
        await skill.handleMessage('批准 PCT 1000'),
      ];

      responses.forEach(response => {
        expect(response).toContain('批准');
      });
    });

    test('should recognize help intent', async () => {
      const response = await skill.handleMessage('帮助');
      expect(response).toContain('PPA Market Skill 使用帮助');
      expect(response).toContain('支持的功能');
    });
  });

  describe('Validation', () => {
    test('should require complete information for buy', async () => {
      const responses = [
        await skill.handleMessage('购买 yes token'), // No amount
        await skill.handleMessage('购买 100 个 token'), // No outcome
      ];

      responses.forEach(response => {
        expect(response).toContain('请提供完整信息');
        expect(response).toContain('购买数量');
        expect(response).toContain('预测方向');
      });
    });
  });

  describe('Transaction Simulation', () => {
    test('should simulate buy transaction', async () => {
      // This is a simple test that checks if the method is callable
      // In real scenario, this would require a testnet connection
      const response = await skill.buy('1');
      expect(typeof response).toBe('string');
    });

    test('should simulate sell transaction', async () => {
      // This is a simple test that checks if the method is callable
      // In real scenario, this would require a testnet connection
      const response = await skill.sell('1');
      expect(typeof response).toBe('string');
    });
  });
});
