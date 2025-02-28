import React from 'react';
import { motion } from 'framer-motion';

function ExpenseCard({ category, amount, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-600">{category}</h3>
        <span className={`text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{amount}</p>
    </motion.div>
  );
}

export default ExpenseCard;
