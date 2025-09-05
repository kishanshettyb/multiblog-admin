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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  const { data: categoriesData } = useGetAllCategory()

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

  const { data: categoryData } = useGetCategoryById(editingCategory?.documentId || '')

  React.useEffect(() => {
    if (categoryData?.data) {
      const category = categoryData.data.data
      form.reset({
        category_name: category.category_name,
        category_url: category.category_url
      })
    } else {
      form.reset({
        category_name: '',
        category_url: ''
      })
    }
  }, [categoryData, form, isDialogOpen])

  React.useEffect(() => {
    if (!isDialogOpen) {
      setEditingCategory(null)
    }
  }, [isDialogOpen])

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'secondary'
      default:
        return 'outline'
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
    accessorKey: 'category_name',
    header: 'Category Name',
    cell: ({ row }) => (
      <div className="font-medium capitalize">{row.getValue('category_name')}</div>
    )
  },
  {
    accessorKey: 'category_url',
    header: 'Category URL',
    cell: ({ row }) => (
      <Badge variant="secondary" className="lowercase">
        {row.getValue('category_url')}
      </Badge>
    )
  },
  {
    accessorKey: 'category_image_url',
    header: 'Image URL',
    cell: ({ row }) => {
      const imageUrl = row.getValue('category_image_url') as string
      return (
        <div className="max-w-[150px] truncate text-xs text-muted-foreground">
          {imageUrl || 'No image'}
        </div>
      )
    }
  },
  {
    accessorKey: 'domains',
    header: 'Domains',
    cell: ({ row }) => {
      const domains = row.original.domains
      return (
        <div className="text-sm">
          {domains && domains.length > 0 ? (
            <Badge variant="outline">
              {domains.length} domain{domains.length !== 1 ? 's' : ''}
            </Badge>
          ) : (
            <span className="text-muted-foreground">No domains</span>
          )}
        </div>
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
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleEdit(category)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        
          
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
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your blog categories
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  
                  <div className="flex justify-end gap-4 pt-4">
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

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={categoriesData?.data?.data || []} 
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}