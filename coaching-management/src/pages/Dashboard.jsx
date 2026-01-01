import React from 'react';
import { useData } from '../context/DataContext';
import { Users, DollarSign, TrendingDown, TrendingUp, Calendar } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {trend && (
        <div className={`flex items-center text-xs font-medium mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
           {trend.isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
           <span>{trend.value} from last month</span>
        </div>
      )}
    </div>
    <div className={`p-4 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const { students, fees, expenses } = useData();

  const totalStudents = students.length;

  // Calculate total income (mock calculation based on fees array)
  const totalIncome = fees.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Calculate total expense
  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Net Profit
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          color="bg-blue-500"
          trend={{ isPositive: true, value: '12%' }}
        />
        <DashboardCard
          title="Total Income"
          value={`৳${totalIncome.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          trend={{ isPositive: true, value: '8%' }}
        />
        <DashboardCard
          title="Total Expenses"
          value={`৳${totalExpense.toLocaleString()}`}
          icon={TrendingDown}
          color="bg-red-500"
          trend={{ isPositive: false, value: '2%' }}
        />
        <DashboardCard
          title="Net Profit"
          value={`৳${netProfit.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-indigo-500"
          trend={{ isPositive: netProfit > 0, value: '5%' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Admissions</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead>
                 <tr className="border-b border-gray-200 text-gray-500">
                   <th className="pb-3 font-medium">Name</th>
                   <th className="pb-3 font-medium">Class</th>
                   <th className="pb-3 font-medium">Batch</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {students.slice(-5).reverse().map(student => (
                   <tr key={student.id} className="hover:bg-gray-50">
                     <td className="py-3 text-gray-800 font-medium">{student.name}</td>
                     <td className="py-3 text-gray-600">Class {student.class}</td>
                     <td className="py-3 text-gray-600">{student.batch}</td>
                   </tr>
                 ))}
                 {students.length === 0 && (
                   <tr>
                     <td colSpan="3" className="py-4 text-center text-gray-500">No students found</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Recent Financial Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
           <div className="space-y-4">
             {fees.slice(-3).reverse().map(fee => (
               <div key={`fee-${fee.id}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-200 rounded-full text-green-700">
                     <DollarSign size={16} />
                   </div>
                   <div>
                     <p className="font-medium text-gray-800">Fee Received</p>
                     <p className="text-xs text-green-600">Student ID: {fee.studentId}</p>
                   </div>
                 </div>
                 <span className="font-bold text-green-700">+৳{fee.amount}</span>
               </div>
             ))}
             {expenses.slice(-3).reverse().map(expense => (
               <div key={`exp-${expense.id}`} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-red-200 rounded-full text-red-700">
                     <TrendingDown size={16} />
                   </div>
                   <div>
                     <p className="font-medium text-gray-800">{expense.description}</p>
                     <p className="text-xs text-red-600">{expense.category}</p>
                   </div>
                 </div>
                 <span className="font-bold text-red-700">-৳{expense.amount}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
