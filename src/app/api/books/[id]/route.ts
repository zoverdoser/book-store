import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = params

    await prisma.book.delete({
      where: { id },
    })

    return successResponse(null)
  } catch (error) {
    console.error('Error deleting book:', error)
    return errorResponse('Internal Server Error', 500)
  }
}
