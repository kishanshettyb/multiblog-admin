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
import { useGetAllCategory, useGetCategoryById } from '@/services/query/category/category'
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory
} from '@/services/mutation/category/category'

export type Category = {
  id: number
  documentId: string
  category_name: string
  slug: string
  category_status: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

const formSchema = z.object({
  category_name: z.string().min(1, { message: 'Category name is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  category_status: z.enum(['active', 'inactive'])
})

export default function CategoryTable() {
  const { data, isLoading } = useGetAllCategory()
  const deleteMutation = useDeleteCategory()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: '',
      slug: '',
      category_status: 'active'
    }
  })

  // Use the hook with proper typing and enabled condition
  const { data: categoryData } = useGetCategoryById(Number(editingCategory?.id))

  React.useEffect(() => {
    if (editingCategory) {
      // Use the editingCategory data directly since it already contains all the fields we need
      form.reset({
        category_name: editingCategory.category_name,
        slug: editingCategory.slug,
        category_status: editingCategory.category_status as 'active' | 'inactive'
      })
    } else {
      form.reset({
        category_name: '',
        slug: '',
        category_status: 'active'
      })
    }
  }, [editingCategory])

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      data: {
        category_name: values.category_name,
        slug: values.slug,
        category_status: values.category_status
      }
    }

    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            setEditingCategory(null)
            toast.success('Category updated successfully')
          },
          onError: () => {
            toast.error('Failed to update category')
          }
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false)
          toast.success('Category created successfully')
        },
        onError: () => {
          toast.error('Failed to create category')
        }
      })
    }
  }

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: 'category_name',
      header: 'Category Name',
      cell: ({ row }) => <div className="capitalize">{row.getValue('category_name')}</div>
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => <div className="lowercase">{row.getValue('slug')}</div>
    },
    {
      accessorKey: 'category_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('category_status') as string
        return (
          <div className={`capitalize ${status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
            {status}
          </div>
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
        const category = row.original
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleEdit(category)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(category.id)}
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
                  setEditingCategory(null)
                  setIsDialogOpen(true)
                }}
              >
                Create Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category_status"
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
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingCategory(null)
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
                        : editingCategory
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
