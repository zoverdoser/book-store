import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  msg: string
  data: T | null
}

export function successResponse<T>(data: T | null = null, msg: string = ''): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    msg,
    data,
  })
}

export function errorResponse(msg: string, status: number = 200): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      msg,
      data: null,
    },
    { status },
  )
}
