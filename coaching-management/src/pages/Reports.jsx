import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const { fees, expenses } = useData();

  // Prepare data for monthly comparison
  const monthlyData = {};

  fees.forEach(fee => {
    if (!monthlyData[fee.month]) {
      monthlyData[fee.month] = { name: fee.month, income: 0, expense: 0 };
    }
    monthlyData[fee.month].income += fee.amount;
  });

  // For expenses, we need to map date to month name since expenses store full date
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const month = date.toLocaleString('default', { month: 'long' });
    if (!monthlyData[month]) {
      monthlyData[month] = { name: month, income: 0, expense: 0 };
    }
    monthlyData[month].expense += expense.amount;
  });

  const chartData = Object.values(monthlyData);

  // Prepare data for Expense Category Pie Chart
  const expenseCategories = {};
  expenses.forEach(expense => {
    const cat = expense.category || 'Other';
    if (!expenseCategories[cat]) {
      expenseCategories[cat] = 0;
    }
    expenseCategories[cat] += expense.amount;
  });

  const pieData = Object.keys(expenseCategories).map(key => ({
    name: key,
    value: expenseCategories[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Income vs Expenses (Monthly)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {chartData.length === 0 && (
             <p className="text-center text-gray-500 mt-4">Not enough data to display chart.</p>
          )}
        </div>

        {/* Expense Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Expense Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `৳${value}`} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
           {pieData.length === 0 && (
             <p className="text-center text-gray-500 mt-4">No expense data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
