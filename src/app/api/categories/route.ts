import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return successResponse(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return errorResponse('获取分类失败', 500)
  }
}
