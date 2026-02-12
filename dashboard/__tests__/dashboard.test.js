const Dashboard = require('../dashboard');

test('dashboard balance operations', () => {
  const d = new Dashboard();
  d.addIncome(100);
  d.addIncome(50);
  d.addExpense(30);

  expect(d.getTotalIncome()).toBe(150);
  expect(d.getTotalExpenses()).toBe(30);
  expect(d.getBalance()).toBe(120);
});

test('dashboard rejects invalid amounts', () => {
  const d = new Dashboard();
  expect(() => d.addIncome(-5)).toThrow(TypeError);
  expect(() => d.addExpense(-1)).toThrow(TypeError);
  expect(() => d.addIncome(NaN)).toThrow(TypeError);
});
