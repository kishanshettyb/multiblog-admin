'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/DataTable'
import { useGetAllDomain } from '@/services/query/category/category'

export type Domain = {
  id: number
  documentId: string
  domain_name: string
  domain_status: string
  logo_url: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export default function DomainTable() {
  const { data, isLoading } = useGetAllDomain()

  const columns: ColumnDef<Domain>[] = [
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
      accessorKey: 'domain_name',
      header: 'Domain Name',
      cell: ({ row }) => <div className="lowercase">{row.getValue('domain_name')}</div>
    },
    {
      accessorKey: 'domain_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('domain_status') as string
        return (
          <div className={`capitalize ${status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
            {status}
          </div>
        )
      }
    },
    {
      accessorKey: 'logo_url',
      header: 'Logo',
      cell: ({ row }) => {
        const logoUrl = row.getValue('logo_url') as string
        return logoUrl ? (
          <img src={logoUrl} alt="Domain Logo" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="text-gray-400">No logo</div>
        )
      }
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
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'))
        return date.toLocaleDateString()
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const domain = row.original
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => console.log('Edit', domain.id)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => console.log('Delete', domain.id)}
            >
              Delete
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="w-screen">
      <div className="overflow-x-auto w-3/4">
        <DataTable columns={columns} data={data?.data?.data || []} />
      </div>
    </div>
  )
}
