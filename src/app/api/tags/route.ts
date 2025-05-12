import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const keyword = searchParams.get('keyword') || ''
    const pageSize = 10

    const where = keyword
      ? {
          name: {
            contains: keyword,
          },
        }
      : {}

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.tag.count({ where }),
    ])

    return successResponse({
      data: tags,
      total,
      currentPage: page,
      pageSize,
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return errorResponse('获取标签失败', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name) {
      return errorResponse('标签名称不能为空', 400)
    }

    const tag = await prisma.tag.create({
      data: {
        name,
      },
    })

    return successResponse(tag)
  } catch (error) {
    console.error('Error creating tag:', error)
    return errorResponse('创建标签失败', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name } = await request.json()

    if (!id || !name) {
      return errorResponse('标签ID和名称不能为空', 400)
    }

    const tag = await prisma.tag.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    return successResponse(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return errorResponse('更新标签失败', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return errorResponse('标签ID不能为空', 400)
    }

    await prisma.tag.delete({
      where: {
        id,
      },
    })

    return successResponse(null, '标签删除成功')
  } catch (error) {
    console.error('Error deleting tag:', error)
    return errorResponse('删除标签失败', 500)
  }
}
