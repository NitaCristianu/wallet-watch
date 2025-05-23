"use client"

import * as React from "react"

export default function TransactionCard() {
  const transactions = [
    {
      title: "Monthly Salary",
      subtitle: "Monthly Basis",
      amount: "+ $3.200,00",
      positive: true,
    },
    {
      title: "Grocery Shopping",
      subtitle: "Monthly Basis",
      amount: "- $120,00",
      positive: false,
    },
    {
      title: "Paying Rent",
      subtitle: "Yearly Basis",
      amount: "- $2.400,00",
      positive: false,
    },
  ]

  return (
    <div className="rounded-xl mt-50 ml-[300px] bg-white p-5 shadow-sm w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Today's transactions</h3>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div key={index} className="flex items-start justify-between">
            <div>
              <div className="font-medium">{tx.title}</div>
              <div className="text-sm text-gray-500">{tx.subtitle}</div>
            </div>
            <div
              className={`font-semibold ${
                tx.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.amount}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full rounded-lg border-2 border-gray-300 py-2 text-sm font-medium hover:bg-gray-100 transition">
        View All Transaction
      </button>
    </div>
  )
}
