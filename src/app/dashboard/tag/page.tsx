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
import { useGetAllTag, useGetTagsById } from '@/services/query/category/category'
import { useCreateTags, useDeleteTags, useUpdateTags } from '@/services/mutation/category/category'

export type Tag = {
  id: number
  documentId: string
  tag_name: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

const formSchema = z.object({
  tag_name: z.string().min(1, { message: 'Tag name is required' }),
  slug: z.string().min(1, { message: 'Slug is required' })
})

export default function TagTable() {
  const { data } = useGetAllTag()
  const deleteMutation = useDeleteTags()
  const createMutation = useCreateTags()
  const updateMutation = useUpdateTags()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag_name: '',
      slug: ''
    }
  })

  // Use the hook with proper typing and enabled condition
  const { data: tagData } = useGetTagsById(editingTag?.id?.toString() || '', {
    enabled: !!editingTag?.id
  })

  React.useEffect(() => {
    if (editingTag) {
      form.reset({
        tag_name: editingTag.tag_name,
        slug: editingTag.slug
      })
    } else {
      form.reset({
        tag_name: '',
        slug: ''
      })
    }
  }, [editingTag])

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setIsDialogOpen(true)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      data: {
        tag_name: values.tag_name,
        slug: values.slug
      }
    }

    if (editingTag) {
      updateMutation.mutate(
        { id: editingTag.id, payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            setEditingTag(null)
            toast.success('Tag updated successfully')
          },
          onError: () => {
            toast.error('Failed to update tag')
          }
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false)
          toast.success('Tag created successfully')
        },
        onError: () => {
          toast.error('Failed to create tag')
        }
      })
    }
  }

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
      header: 'Slug',
      cell: ({ row }) => <div className="lowercase">{row.getValue('slug')}</div>
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
        const tag = row.original
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleEdit(tag)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(tag.id)}
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
                  setEditingTag(null)
                  setIsDialogOpen(true)
                }}
              >
                Create Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingTag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tag_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tag name" {...field} />
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
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingTag(null)
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
                        : editingTag
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
