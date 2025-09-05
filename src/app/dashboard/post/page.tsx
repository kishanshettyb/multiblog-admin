'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit, Trash2, Plus, Eye } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useGetAllPosts, useGetPostById } from '@/services/query/posts/post'
import { useCreatePost, useDeletePost, useUpdatePost } from '@/services/mutation/posts/post'
import { useGetAllDomain } from '@/services/query/domain/domain'
import { useGetAllCategory } from '@/services/query/category/category'

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
  domains?: Array<{
    id: number
    documentId: string
    domain_name: string
    domain_url: string
  }>
  categories?: Array<{
    id: number
    documentId: string
    category_name: string
    category_url: string
  }>
}

const formSchema = z.object({
  blog_post_title: z.string().min(1, { message: 'Blog post title is required' }),
  blog_post_description: z.string().min(1, { message: 'Blog post description is required' }),
  blog_post_image_url: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  blog_post_status: z.enum(['publish', 'save', 'draft']),
  domain_id: z.string().min(1, { message: 'Please select a domain' }),
  category_id: z.string().min(1, { message: 'Please select a category' })
})

export default function BlogPostTable() {
  const { data: postsData } = useGetAllPosts()
  const { data: domainsData } = useGetAllDomain()
  const { data: categoriesData } = useGetAllCategory()
  const [editorContent, setEditorContent] = React.useState<unknown>(null)
  const quillEditorRef = React.useRef<unknown>(null)

  const deleteMutation = useDeletePost()
  const createMutation = useCreatePost()
  const updateMutation = useUpdatePost()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingBlogPost, setEditingBlogPost] = React.useState<BlogPost | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [blogPostToDelete, setBlogPostToDelete] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blog_post_title: '',
      blog_post_description: '',
      blog_post_image_url: '',
      blog_post_status: 'save',
      domain_id: '',
      category_id: ''
    }
  })

  const { data: blogPostData } = useGetPostById(editingBlogPost?.documentId || '')

  React.useEffect(() => {
    if (blogPostData?.data) {
      const post = blogPostData.data.data
      form.reset({
        blog_post_title: post.blog_post_title,
        blog_post_description: post.blog_post_description,
        blog_post_image_url: post.blog_post_image_url,
        blog_post_status: post.blog_post_status,
        domain_id: post.domains && post.domains.length > 0 ? post.domains[0].documentId : '',
        category_id: post.categories && post.categories.length > 0 ? post.categories[0].documentId : ''
      })

      // Set the editor content in the expected structured format
      if (post.blog_post_content) {
        let contentToSet

        if (Array.isArray(post.blog_post_content)) {
          contentToSet = [...post.blog_post_content]
        } else if (typeof post.blog_post_content === 'string') {
          // If content is stored as string, try to parse it
          try {
            contentToSet = JSON.parse(post.blog_post_content)
          } catch {
            // If parsing fails, create a simple paragraph with the text
            contentToSet = [
              {
                type: 'paragraph',
                children: [{ text: post.blog_post_content, type: 'text' }]
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
        blog_post_status: 'save',
        domain_id: '',
        category_id: ''
      })
      setEditorContent(null)
    }
  }, [blogPostData, isDialogOpen])

  React.useEffect(() => {
    if (!isDialogOpen) {
      setEditingBlogPost(null)
      setEditorContent(null)
    }
  }, [isDialogOpen])

  const handleDelete = (documentId: string) => {
    setBlogPostToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (blogPostToDelete) {
      deleteMutation.mutate(blogPostToDelete, {
        onSuccess: () => {
          toast.success('Blog post deleted successfully')
          setDeleteDialogOpen(false)
          setBlogPostToDelete(null)
        },
        onError: () => {
          toast.error('Failed to delete blog post')
          setDeleteDialogOpen(false)
          setBlogPostToDelete(null)
        }
      })
    }
  }

  const handleEdit = (blogPost: BlogPost) => {
    setEditingBlogPost(blogPost)
    setIsDialogOpen(true)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Get the latest content from the editor in structured format
    const finalContent = quillEditorRef.current?.getContent() || editorContent

    const payload = {
      blog_post_title: values.blog_post_title,
      blog_post_description: values.blog_post_description,
      blog_post_content: finalContent,
      blog_post_image_url: values.blog_post_image_url,
      blog_post_status: values.blog_post_status,
      domains: {
        connect: [{
          id: domainsData?.data?.data?.find(d => d.documentId === values.domain_id)?.id,
          documentId: values.domain_id,
          isTemporary: true
        }]
      },
      categories: {
        connect: [{
          id: categoriesData?.data?.data?.find(c => c.documentId === values.category_id)?.id,
          documentId: values.category_id,
          isTemporary: true
        }]
      }
    }

    if (editingBlogPost) {
      updateMutation.mutate(
        { id: editingBlogPost.documentId, payload: { data: payload } },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            setEditingBlogPost(null)
            toast.success('Blog post updated successfully')
          },
          onError: (error) => {
            console.error('Update error:', error)
            toast.error('Failed to update blog post')
          }
        }
      )
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            toast.success('Blog post created successfully')
          },
          onError: (error) => {
            console.error('Create error:', error)
            toast.error('Failed to create blog post')
          }
        }
      )
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'publish':
        return 'success'
      case 'save':
        return 'secondary'
      case 'draft':
        return 'outline'
      default:
        return 'outline'
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
      accessorKey: 'blog_post_title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium" title={row.getValue('blog_post_title')}>
          {row.getValue('blog_post_title')}
        </div>
      )
    },
    {
      accessorKey: 'blog_post_description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue('blog_post_description')}>
          {row.getValue('blog_post_description')}
        </div>
      )
    },
    {
      accessorKey: 'domains',
      header: 'Domain',
      cell: ({ row }) => {
        const domains = row.original.domains
        return (
          <div className="max-w-[120px]">
            {domains && domains.length > 0 ? (
              <Badge variant="secondary" className="truncate">
                {domains[0].domain_name}
              </Badge>
            ) : (
              <span className="text-muted-foreground">No domain</span>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'categories',
      header: 'Category',
      cell: ({ row }) => {
        const categories = row.original.categories
        return (
          <div className="max-w-[120px]">
            {categories && categories.length > 0 ? (
              <Badge variant="outline" className="truncate">
                {categories[0].category_name}
              </Badge>
            ) : (
              <span className="text-muted-foreground">No category</span>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'blog_post_status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue('blog_post_status'))}>
          {row.getValue('blog_post_status')}
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
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const blogPost = row.original
        return (
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleEdit(blogPost)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
             <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            window.open(`/dashboard/post/view?documentId=${blogPost.documentId}`, '_blank')
          }}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
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
            <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and content
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBlogPost(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBlogPost ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="blog_post_title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Blog Post Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter blog post title"
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
                          <FormLabel>Blog Post Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter blog post description"
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
                              placeholder="https://example.com/image.jpg"
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
                      name="domain_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {domainsData?.data?.data?.map((domain) => (
                                <SelectItem key={domain.documentId} value={domain.documentId}>
                                  {domain.domain_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoriesData?.data?.data?.map((category) => (
                                <SelectItem key={category.documentId} value={category.documentId}>
                                  {category.category_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingBlogPost(null)
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
                        : editingBlogPost
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
            <CardTitle>All Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={postsData?.data?.data || []} 
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}