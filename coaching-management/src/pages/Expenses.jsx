import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PlusCircle, Receipt, Trash2 } from 'lucide-react';

const Expenses = () => {
  const { expenses, addExpense } = useData();
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newExpense.description && newExpense.amount) {
      addExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({
        description: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Expense Tracking</h2>
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-bold border border-red-100">
          Total Expenses: ৳{totalExpense.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-red-600" />
              Add Expense
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. Marker pens"
                  value={newExpense.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={newExpense.category}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Category --</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  name="amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 500"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={newExpense.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Record Expense
              </button>
            </form>
          </div>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center">
               <h3 className="text-lg font-bold text-gray-800">Recent Expenses</h3>
               <Receipt size={20} className="text-gray-400" />
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                   <tr>
                     <th className="px-6 py-3">Date</th>
                     <th className="px-6 py-3">Description</th>
                     <th className="px-6 py-3">Category</th>
                     <th className="px-6 py-3 text-right">Amount</th>
                     <th className="px-6 py-3 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                   {expenses.slice().reverse().map(expense => (
                     <tr key={expense.id} className="hover:bg-gray-50">
                       <td className="px-6 py-3 text-gray-600">{expense.date}</td>
                       <td className="px-6 py-3 font-medium text-gray-800">{expense.description}</td>
                       <td className="px-6 py-3">
                         <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{expense.category || 'General'}</span>
                       </td>
                       <td className="px-6 py-3 text-right font-bold text-red-600">-৳{expense.amount}</td>
                       <td className="px-6 py-3 text-right">
                         <button className="text-gray-400 hover:text-red-500 transition-colors">
                           <Trash2 size={16} />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {expenses.length === 0 && (
                     <tr>
                       <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No expenses recorded.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
