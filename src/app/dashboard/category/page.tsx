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
  category_url: string
  domains: string
  domain_name?: string
  category_status: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

const formSchema = z.object({
  category_name: z.string().min(1, { message: 'Category name is required' }),
  category_url: z.string().min(1, { message: 'Category URL is required' })
})

export default function CategoryTable() {
  const { data } = useGetAllCategory()

  const deleteMutation = useDeleteCategory()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: '',
      category_url: ''
    }
  })

  const { data: categoryData } = useGetCategoryById(editingCategory?.documentId)

  React.useEffect(() => {
    if (categoryData?.data) {
      form.reset({
        category_name: categoryData.data.data.category_name,
        category_url: categoryData.data.datacategory_url
      })
    } else {
      form.reset({
        category_name: '',
        category_url: ''
      })
    }
  }, [categoryData, form])

  const handleDelete = (documentId: string) => {
    setCategoryToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete, {
        onSuccess: () => {
          toast.success('Category deleted successfully')
          setDeleteDialogOpen(false)
          setCategoryToDelete(null)
        },
        onError: () => {
          toast.error('Failed to delete category')
          setDeleteDialogOpen(false)
          setCategoryToDelete(null)
        }
      })
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
        category_url: values.category_url
      }
    }

    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.documentId, payload },
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
      accessorKey: 'category_url',
      header: 'Category URL',
      cell: ({ row }) => <div className="lowercase">{row.getValue('category_url')}</div>
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
            <AlertDialog
              open={deleteDialogOpen && categoryToDelete === category.documentId}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.documentId)}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the category
                    {category.category_name} and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
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
                          <Input
                            placeholder="Enter category name"
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
                    name="category_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category URL"
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
      </div>

      <div className="px-4">
        <DataTable columns={columns} data={data?.data?.data || []} />
      </div>
    </>
  )
}
