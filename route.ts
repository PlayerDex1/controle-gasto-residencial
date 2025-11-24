import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { type, amount, dueDate, description, paid, paidDate } = body
    
    const date = new Date(dueDate)
    const month = format(date, 'yyyy-MM')
    const year = date.getFullYear()

    const expense = await prisma.fixedExpense.update({
      where: { id: params.id },
      data: {
        type,
        amount: parseFloat(amount),
        dueDate: date,
        description,
        paid: paid || false,
        paidDate: paidDate ? new Date(paidDate) : null,
        month,
        year,
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar despesa' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fixedExpense.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Despesa deletada com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar despesa' }, { status: 500 })
  }
}

