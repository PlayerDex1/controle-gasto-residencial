'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Receipt } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface FixedExpense {
  id: string
  type: string
  amount: number
  dueDate: string
  paid: boolean
  month: string
  year: number
}

interface MarketPurchase {
  id: string
  totalAmount: number
  date: string
  month: string
  year: number
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<FixedExpense[]>([])
  const [purchases, setPurchases] = useState<MarketPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))

  useEffect(() => {
    fetchData()
  }, [selectedMonth])

  const fetchData = async () => {
    try {
      const [expensesRes, purchasesRes] = await Promise.all([
        fetch('/api/fixed-expenses'),
        fetch('/api/market-purchases'),
      ])

      const expensesData = await expensesRes.json()
      const purchasesData = await purchasesRes.json()

      // Filtrar por mês selecionado
      const monthExpenses = expensesData.filter((e: FixedExpense) => e.month === selectedMonth)
      const monthPurchases = purchasesData.filter((p: MarketPurchase) => p.month === selectedMonth)

      setExpenses(monthExpenses)
      setPurchases(monthPurchases)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalFixedExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalMarketPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0)
  const totalExpenses = totalFixedExpenses + totalMarketPurchases

  const expensesByType = expenses.reduce((acc, exp) => {
    acc[exp.type] = (acc[exp.type] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(expensesByType).map(([type, amount]) => ({
    name: getTypeLabel(type),
    value: amount,
  }))

  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const month = format(subMonths(new Date(), i), 'yyyy-MM')
    const monthExpenses = expenses.filter((e: FixedExpense) => e.month === month)
    const monthPurchases = purchases.filter((p: MarketPurchase) => p.month === month)
    monthlyData.push({
      month: format(new Date(month + '-01'), 'MMM'),
      despesas: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      mercado: monthPurchases.reduce((sum, p) => sum + p.totalAmount, 0),
    })
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      aluguel: 'Aluguel',
      luz: 'Luz',
      agua: 'Água',
      internet: 'Internet',
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
          <div>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Gastos</p>
                <p className="text-2xl font-bold text-gray-800">R$ {totalExpenses.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Despesas Fixas</p>
                <p className="text-2xl font-bold text-gray-800">R$ {totalFixedExpenses.toFixed(2)}</p>
              </div>
              <Receipt className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mercado</p>
                <p className="text-2xl font-bold text-gray-800">R$ {totalMarketPurchases.toFixed(2)}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Compras</p>
                <p className="text-2xl font-bold text-gray-800">{purchases.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Despesas por Tipo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Evolução Mensal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas Fixas" />
                <Bar dataKey="mercado" fill="#10b981" name="Mercado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detalhamento */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Detalhamento do Mês</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Despesas Fixas</h3>
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma despesa neste mês</p>
              ) : (
                <div className="space-y-2">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {getTypeLabel(expense.type)} - {format(new Date(expense.dueDate), 'dd/MM')}
                      </span>
                      <span className="text-gray-800 font-medium">R$ {expense.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Compras de Mercado</h3>
              {purchases.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma compra neste mês</p>
              ) : (
                <div className="space-y-2">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {format(new Date(purchase.date), 'dd/MM')}
                      </span>
                      <span className="text-gray-800 font-medium">R$ {purchase.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

