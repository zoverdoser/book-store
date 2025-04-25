import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return successResponse(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return errorResponse('获取标签失败', 500)
  }
}
