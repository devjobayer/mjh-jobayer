import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, PlusCircle, CheckCircle } from 'lucide-react';

const Fees = () => {
  const { students, fees, addFee } = useData();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePayment = (e) => {
    e.preventDefault();
    if (selectedStudentId && amount) {
      addFee({
        studentId: parseInt(selectedStudentId),
        amount: parseInt(amount),
        month: month || new Date().toLocaleString('default', { month: 'long' }),
        date: new Date().toISOString().split('T')[0]
      });
      setSuccessMsg('Fee collection recorded successfully!');
      setAmount('');
      setMonth('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Helper to get student name by ID
  const getStudentName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Fees Collection</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-blue-600" />
              Collect Fees
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                {successMsg}
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                >
                  <option value="">-- Select Student --</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} (ID: {student.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Current Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 1500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Record Payment
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 border-b border-gray-100">
               <h3 className="text-lg font-bold text-gray-800">Payment History</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                   <tr>
                     <th className="px-6 py-3">Date</th>
                     <th className="px-6 py-3">Student</th>
                     <th className="px-6 py-3">Month</th>
                     <th className="px-6 py-3 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                   {fees.slice().reverse().map(fee => (
                     <tr key={fee.id} className="hover:bg-gray-50">
                       <td className="px-6 py-3 text-gray-600">{fee.date}</td>
                       <td className="px-6 py-3 font-medium text-gray-800">{getStudentName(fee.studentId)}</td>
                       <td className="px-6 py-3 text-gray-600">{fee.month}</td>
                       <td className="px-6 py-3 text-right font-bold text-green-600">৳{fee.amount}</td>
                     </tr>
                   ))}
                   {fees.length === 0 && (
                     <tr>
                       <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No payment records found.</td>
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

export default Fees;
