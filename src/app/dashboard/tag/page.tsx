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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { useGetAllTag, useGetTagsById } from '@/services/query/tags/tags'
import { useCreateTags, useDeleteTags, useUpdateTags } from '@/services/mutation/tags/tags'

export type Tag = {
  id: number
  documentId: string
  tag_name: string
  tag_url: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

const formSchema = z.object({
  tag_name: z.string().min(1, { message: 'Tag name is required' }),
  tag_url: z.string().min(1, { message: 'Tag URL is required' })
})

export default function TagTable() {
  const { data: tagsData } = useGetAllTag()
  const deleteMutation = useDeleteTags()
  const createMutation = useCreateTags()
  const updateMutation = useUpdateTags()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [tagToDelete, setTagToDelete] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag_name: '',
      tag_url: ''
    }
  })

  const { data: tagData } = useGetTagsById(editingTag?.documentId || '', {
    enabled: !!editingTag?.documentId
  })

  React.useEffect(() => {
    if (tagData?.data) {
      form.reset({
        tag_name: tagData.data.tag_name,
        tag_url: tagData.data.tag_url
      })
    } else {
      form.reset({
        tag_name: '',
        tag_url: ''
      })
    }
  }, [tagData, form, isDialogOpen])

  React.useEffect(() => {
    if (!isDialogOpen) {
      setEditingTag(null)
    }
  }, [isDialogOpen])

  const handleDelete = (documentId: string) => {
    setTagToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (tagToDelete) {
      deleteMutation.mutate(tagToDelete, {
        onSuccess: () => {
          toast.success('Tag deleted successfully')
          setDeleteDialogOpen(false)
          setTagToDelete(null)
        },
        onError: () => {
          toast.error('Failed to delete tag')
          setDeleteDialogOpen(false)
          setTagToDelete(null)
        }
      })
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
        tag_url: values.tag_url
      }
    }

    if (editingTag) {
      updateMutation.mutate(
        { id: editingTag.documentId, payload },
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
      cell: ({ row }) => (
        <div className="font-medium capitalize">{row.getValue('tag_name')}</div>
      )
    },
    {
      accessorKey: 'tag_url',
      header: 'Tag URL',
      cell: ({ row }) => (
        <Badge variant="secondary" className="lowercase">
          {row.getValue('tag_url')}
        </Badge>
      )
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
        const tag = row.original
        return (
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleEdit(tag)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog
              open={deleteDialogOpen && tagToDelete === tag.documentId}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(tag.documentId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the tag
                    "{tag.tag_name}" and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setTagToDelete(null)}>
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
            <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
            <p className="text-muted-foreground">
              Manage your tags and categories
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTag(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingTag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="tag_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tag name"
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
                    name="tag_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter tag URL" 
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

        <Card>
          <CardHeader>
            <CardTitle>All Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={tagsData?.data?.data || []} 
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}