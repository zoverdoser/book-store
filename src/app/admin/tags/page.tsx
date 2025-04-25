'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TagList from './components/TagList'
import CategoryList from './components/CategoryList'

export default function TagsPage() {
  const [activeTab, setActiveTab] = useState('tags')

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">分类与标签管理</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tags">标签管理</TabsTrigger>
          <TabsTrigger value="categories">分类管理</TabsTrigger>
        </TabsList>
        <TabsContent value="tags">
          <TagList />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
