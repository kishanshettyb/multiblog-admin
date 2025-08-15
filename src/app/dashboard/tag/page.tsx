'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/DataTable'
import { useGetAllTag } from '@/services/query/category/category'

export type Tag = {
  id: number
  documentId: string
  tag_name: string
  slug: string
  createdAt: string
}

export default function TagTable() {
  const { data, isLoading } = useGetAllTag()

  const columns: ColumnDef<Tag>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    {
      accessorKey: 'tag_name',
      header: 'Tag Name',
      cell: ({ row }) => <div className="capitalize">{row.getValue('tag_name')}</div>
    },
    {
      accessorKey: 'slug',
      header: 'Slug'
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return date.toLocaleDateString()
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const tag = row.original
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => console.log('Edit', tag.id)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => console.log('Delete', tag.id)}>
              Delete
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="w-screen ">
      <div className="overflow-x-auto w-3/4">
        <DataTable columns={columns} data={data?.data?.data || []} />
      </div>
    </div>
  )
}
