'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/DataTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useGetAllDomain, useGetDomainById } from '@/services/query/category/category'
import {
  useCreateDomains,
  useDeleteDomain,
  useUpdateDomains
} from '@/services/mutation/category/category'

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

const formSchema = z.object({
  domain_name: z.string().min(1, { message: 'Domain name is required' }),
  domain_status: z.enum(['active', 'inactive']),
  logo_url: z.string().url({ message: 'Invalid URL format' }).optional()
})

export default function DomainTable() {
  const { data, isLoading } = useGetAllDomain()
  const deleteMutation = useDeleteDomain()
  const createMutation = useCreateDomains()
  const updateMutation = useUpdateDomains()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingDomain, setEditingDomain] = React.useState<Domain | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain_name: '',
      domain_status: 'active',
      logo_url: ''
    }
  })

  const { data: domainData } = useGetDomainById(editingDomain?.id?.toString() || '', {
    enabled: !!editingDomain?.id
  })

  React.useEffect(() => {
    if (editingDomain) {
      form.reset({
        domain_name: editingDomain.domain_name,
        domain_status: editingDomain.domain_status as 'active' | 'inactive',
        logo_url: editingDomain.logo_url || ''
      })
    } else {
      form.reset({
        domain_name: '',
        domain_status: 'active',
        logo_url: ''
      })
    }
  }, [editingDomain])

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this domain?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain)
    setIsDialogOpen(true)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      data: {
        domain_name: values.domain_name,
        domain_status: values.domain_status,
        ...(values.logo_url && { logo_url: values.logo_url })
      }
    }

    if (editingDomain) {
      updateMutation.mutate(
        { id: editingDomain.id, payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            setEditingDomain(null)
            toast.success('Domain updated successfully')
          },
          onError: () => {
            toast.error('Failed to update domain')
          }
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false)
          toast.success('Domain created successfully')
        },
        onError: () => {
          toast.error('Failed to create domain')
        }
      })
    }
  }

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
            <Button size="sm" onClick={() => handleEdit(domain)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(domain.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="w-screen">
      <div className="overflow-x-auto w-3/4">
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingDomain(null)
                  setIsDialogOpen(true)
                }}
              >
                Create Domain
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingDomain ? 'Edit Domain' : 'Create Domain'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="domain_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter domain name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="domain_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter logo URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingDomain(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Saving...'
                        : editingDomain
                          ? 'Update'
                          : 'Create'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={data?.data?.data || []} />
      </div>
    </div>
  )
}
