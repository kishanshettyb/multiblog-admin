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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
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
  domain_url: string
  domain_status: string
  logo_image_url: string
  icon_image_url: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

const formSchema = z.object({
  domain_name: z.string().min(1, { message: 'Domain name is required' }),
  domain_url: z.string().min(1, { message: 'Domain URL is required' }),
  domain_status: z.enum(['active', 'inactive']),
  logo_image_url: z.string().url({ message: 'Invalid URL format' }).optional().or(z.literal('')),
  icon_image_url: z.string().url({ message: 'Invalid URL format' }).optional().or(z.literal(''))
})

export default function DomainTable() {
  const { data } = useGetAllDomain()
  const deleteMutation = useDeleteDomain()
  const createMutation = useCreateDomains()
  const updateMutation = useUpdateDomains()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingDomain, setEditingDomain] = React.useState<Domain | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [domainToDelete, setDomainToDelete] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain_name: '',
      domain_url: '',
      domain_status: 'active',
      logo_image_url: '',
      icon_image_url: ''
    }
  })

  const { data: domainData } = useGetDomainById(editingDomain?.documentId)

  React.useEffect(() => {
    if (domainData?.data) {
      form.reset({
        domain_name: domainData.data.domain_name,
        domain_url: domainData.data?.data.domain_url,
        domain_status: domainData.data?.data.domain_status as 'active' | 'inactive',
        logo_image_url: domainData.data?.data.logo_image_url || '',
        icon_image_url: domainData.data?.data.icon_image_url || ''
      })
    } else {
      form.reset({
        domain_name: '',
        domain_url: '',
        domain_status: 'active',
        logo_image_url: '',
        icon_image_url: ''
      })
    }
  }, [domainData, form])

  const handleDelete = (documentId: string) => {
    setDomainToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (domainToDelete) {
      deleteMutation.mutate(domainToDelete, {
        onSuccess: () => {
          toast.success('Domain deleted successfully')
          setDeleteDialogOpen(false)
          setDomainToDelete(null)
        },
        onError: () => {
          toast.error('Failed to delete domain')
          setDeleteDialogOpen(false)
          setDomainToDelete(null)
        }
      })
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
        domain_url: values.domain_url,
        domain_status: values.domain_status,
        ...(values.logo_image_url && { logo_image_url: values.logo_image_url }),
        ...(values.icon_image_url && { icon_image_url: values.icon_image_url })
      }
    }

    if (editingDomain) {
      updateMutation.mutate(
        { id: editingDomain.documentId, payload },
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
      cell: ({ row }) => <div className="capitalize">{row.getValue('domain_name')}</div>
    },
    {
      accessorKey: 'domain_url',
      header: 'Domain URL',
      cell: ({ row }) => <div className="lowercase">{row.getValue('domain_url')}</div>
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
      accessorKey: 'logo_image_url',
      header: 'Logo',
      cell: ({ row }) => {
        const logoUrl = row.getValue('logo_image_url') as string
        return logoUrl ? (
          <img src={logoUrl} alt="Domain Logo" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="text-gray-400">No logo</div>
        )
      }
    },
    {
      accessorKey: 'icon_image_url',
      header: 'Icon',
      cell: ({ row }) => {
        const iconUrl = row.getValue('icon_image_url') as string
        return iconUrl ? (
          <img src={iconUrl} alt="Domain Icon" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="text-gray-400">No icon</div>
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
            <AlertDialog
              open={deleteDialogOpen && domainToDelete === domain.documentId}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(domain.documentId)}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the domain
                    {domain.domain_name} and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDomainToDelete(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? 'Deleting...' : 'Continue'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <div className="w-full p-4">
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
                          <Input
                            placeholder="Enter domain name"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="domain_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter domain URL"
                            {...field}
                            value={field.value || ''}
                          />
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
                    name="logo_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter logo URL"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter icon URL"
                            {...field}
                            value={field.value || ''}
                          />
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
      </div>

      <div className="px-4">
        <DataTable columns={columns} data={data?.data?.data || []} />
      </div>
    </>
  )
}
