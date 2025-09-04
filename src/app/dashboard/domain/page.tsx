'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit, Trash2, Plus } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useGetAllDomain, useGetDomainById } from '@/services/query/domain/domain'
import {
  useCreateDomains,
  useDeleteDomain,
  useUpdateDomains
} from '@/services/mutation/domain/domain'

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

  const { data: domainData } = useGetDomainById(editingDomain?.documentId || '')

  React.useEffect(() => {
    if (domainData?.data) {
      form.reset({
        domain_name: domainData.data.domain_name,
        domain_url: domainData.data.domain_url,
        domain_status: domainData.data.domain_status as 'active' | 'inactive',
        logo_image_url: domainData.data.logo_image_url || '',
        icon_image_url: domainData.data.icon_image_url || ''
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
  }, [domainData, form, isDialogOpen])

  React.useEffect(() => {
    if (!isDialogOpen) {
      setEditingDomain(null)
    }
  }, [isDialogOpen])

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'destructive'
      default:
        return 'outline'
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
      cell: ({ row }) => (
        <div className="font-medium max-w-[150px] truncate" title={row.getValue('domain_name')}>
          {row.getValue('domain_name')}
        </div>
      )
    },
    {
      accessorKey: 'domain_url',
      header: 'Domain URL',
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate" title={row.getValue('domain_url')}>
          {row.getValue('domain_url')}
        </div>
      )
    },
    {
      accessorKey: 'domain_status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue('domain_status') as string)}>
          {row.getValue('domain_status') as string}
        </Badge>
      )
    },
    {
      accessorKey: 'logo_image_url',
      header: 'Logo',
      cell: ({ row }) => {
        const logoUrl = row.getValue('logo_image_url') as string
        return logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Domain Logo" 
            className="h-10 w-10 rounded-full object-cover border" 
          />
        ) : (
          <div className="text-muted-foreground text-sm">No logo</div>
        )
      }
    },
    {
      accessorKey: 'icon_image_url',
      header: 'Icon',
      cell: ({ row }) => {
        const iconUrl = row.getValue('icon_image_url') as string
        return iconUrl ? (
          <img 
            src={iconUrl} 
            alt="Domain Icon" 
            className="h-10 w-10 rounded-full object-cover border" 
          />
        ) : (
          <div className="text-muted-foreground text-sm">No icon</div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return (
          <div className="text-sm whitespace-nowrap">
            {date.toLocaleDateString()}
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'))
        return (
          <div className="text-sm whitespace-nowrap">
            {date.toLocaleDateString()}
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const domain = row.original
        return (
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleEdit(domain)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog
              open={deleteDialogOpen && domainToDelete === domain.documentId}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(domain.documentId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the domain
                    "{domain.domain_name}" and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDomainToDelete(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
            <p className="text-muted-foreground">
              Manage your domains and their settings
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDomain(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Domain
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDomain ? 'Edit Domain' : 'Create Domain'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              placeholder="https://example.com"
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="logo_image_url"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Logo Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/logo.png"
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
                        <FormItem className="md:col-span-2">
                          <FormLabel>Icon Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/icon.png"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
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

        <Card>
          <CardHeader>
            <CardTitle>All Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={data?.data?.data || []} 
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}