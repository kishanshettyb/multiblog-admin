'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
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

import { useGetAllPosts, useGetPostById } from '@/services/query/posts/post'
import { useCreatePost, useDeletePost, useUpdatePost } from '@/services/mutation/posts/post'

const QuillEditor = dynamic(() => import('@/components/QuillEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] border rounded-md flex items-center justify-center">
      Loading editor...
    </div>
  )
})

export type BlogPost = {
  id: number
  documentId: string
  blog_post_title: string
  blog_post_description: string
  blog_post_content: unknown
  blog_post_image_url: string
  blog_post_status: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

const formSchema = z.object({
  blog_post_title: z.string().min(1, { message: 'Post title is required' }),
  blog_post_description: z.string().min(1, { message: 'Post description is required' }),
  blog_post_image_url: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  blog_post_status: z.enum(['publish', 'save', 'draft'])
})

export default function BlogPostTable() {
  const { data } = useGetAllPosts()
  const [editorContent, setEditorContent] = React.useState<unknown>(null)
  const quillEditorRef = React.useRef<unknown>(null)

  const deleteMutation = useDeletePost()
  const createMutation = useCreatePost()
  const updateMutation = useUpdatePost()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [postToDelete, setPostToDelete] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blog_post_title: '',
      blog_post_description: '',
      blog_post_image_url: '',
      blog_post_status: 'save'
    }
  })

  const { data: postData } = useGetPostById(editingPost?.documentId || '')

  React.useEffect(() => {
    if (postData?.data) {
      form.reset({
        blog_post_title: postData.data.data.blog_post_title,
        blog_post_description: postData.data.data.blog_post_description,
        blog_post_image_url: postData.data.data.blog_post_image_url,
        blog_post_status: postData.data.data.blog_post_status
      })

      // Set the editor content in the expected structured format
      if (postData.data.data.blog_post_content) {
        let contentToSet

        if (Array.isArray(postData.data.data.blog_post_content)) {
          contentToSet = [...postData.data.data.blog_post_content]
        } else if (typeof postData.data.data.blog_post_content === 'string') {
          // If content is stored as string, try to parse it
          try {
            contentToSet = JSON.parse(postData.data.data.blog_post_content)
          } catch {
            // If parsing fails, create a simple paragraph with the text
            contentToSet = [
              {
                type: 'paragraph',
                children: [{ text: postData.data.data.blog_post_content, type: 'text' }]
              }
            ]
          }
        } else {
          contentToSet = null
        }

        setEditorContent(contentToSet)
      } else {
        setEditorContent(null)
      }
    } else {
      form.reset({
        blog_post_title: '',
        blog_post_description: '',
        blog_post_image_url: '',
        blog_post_status: 'save'
      })
      setEditorContent(null)
    }
  }, [postData, form, isDialogOpen])

  React.useEffect(() => {
    if (!isDialogOpen) {
      setEditingPost(null)
      setEditorContent(null)
    }
  }, [isDialogOpen])

  const handleDelete = (documentId: string) => {
    setPostToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate(postToDelete, {
        onSuccess: () => {
          toast.success('Post deleted successfully')
          setDeleteDialogOpen(false)
          setPostToDelete(null)
        },
        onError: () => {
          toast.error('Failed to delete post')
          setDeleteDialogOpen(false)
          setPostToDelete(null)
        }
      })
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setIsDialogOpen(true)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Get the latest content from the editor in structured format
    const finalContent = quillEditorRef.current?.getContent() || editorContent

    const payload = {
      blog_post_title: values.blog_post_title,
      blog_post_description: values.blog_post_description,
      blog_post_content: finalContent, // Use the structured content from Quill
      blog_post_image_url: values.blog_post_image_url,
      blog_post_status: values.blog_post_status
    }

    if (editingPost) {
      updateMutation.mutate(
        { id: editingPost.documentId, payload: { data: payload } },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            setEditingPost(null)
            toast.success('Post updated successfully')
          },
          onError: (error) => {
            console.error('Update error:', error)
            toast.error('Failed to update post')
          }
        }
      )
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            toast.success('Post created successfully')
          },
          onError: (error) => {
            console.error('Create error:', error)
            toast.error('Failed to create post')
          }
        }
      )
    }
  }

  const columns: ColumnDef<BlogPost>[] = [
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
      accessorKey: 'blog_post_title',
      header: 'Post Title',
      cell: ({ row }) => <div className="capitalize">{row.getValue('blog_post_title')}</div>
    },
    {
      accessorKey: 'blog_post_status',
      header: 'Status',
      cell: ({ row }) => <div className="capitalize">{row.getValue('blog_post_status')}</div>
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
        const post = row.original
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleEdit(post)}>
              Edit
            </Button>
            <AlertDialog
              open={deleteDialogOpen && postToDelete === post.documentId}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(post.documentId)}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the post
                    {post.blog_post_title} and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPostToDelete(null)}>
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
                  setEditingPost(null)
                  setIsDialogOpen(true)
                }}
              >
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="blog_post_title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Post Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter post title"
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
                      name="blog_post_description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Post Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter post description"
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
                      name="blog_post_image_url"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter image URL"
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
                      name="blog_post_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="publish">Publish</SelectItem>
                              <SelectItem value="save">Save</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <QuillEditor
                      ref={quillEditorRef}
                      initialContent={editorContent}
                      onContentChange={setEditorContent}
                    />
                  </FormItem>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingPost(null)
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
                        : editingPost
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
