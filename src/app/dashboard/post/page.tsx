'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
// import TextStyle from '@tiptap/extension-text-style'
import { Editor } from '@tiptap/core'

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

import { useGetAllPosts, useGetPostById } from '@/services/query/category/category'
import { useCreatePost, useDeletePost, useUpdatePost } from '@/services/mutation/category/category'

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

// MenuBar Component with Tailwind CSS
const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false
      }
    }
  })

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-t-md border border-b-0">
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isBold
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } ${!editorState.canBold ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isItalic
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } ${!editorState.canItalic ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isStrike
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } ${!editorState.canStrike ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isCode
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } ${!editorState.canCode ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-2 py-1 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Clear marks
        </button>
        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-2 py-1 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Clear nodes
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isParagraph
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isHeading1
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isHeading2
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isHeading3
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          H3
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isBulletList
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isOrderedList
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isCodeBlock
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 text-sm rounded border ${
            editorState.isBlockquote
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Blockquote
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Horizontal rule
        </button>
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="px-2 py-1 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className={`px-2 py-1 text-sm rounded border ${
            !editorState.canUndo
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className={`px-2 py-1 text-sm rounded border ${
            !editorState.canRedo
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Redo
        </button>
      </div>
    </div>
  )
}

// TiptapEditor Component
const TiptapEditor = ({
  initialContent,
  onContentChange
}: {
  initialContent?: unknown
  onContentChange?: (content: unknown) => void
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Start writing your content here...'
            }
          ]
        }
      ]
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getJSON())
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px]'
      }
    }
  })

  React.useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  if (!editor) {
    return (
      <div className="p-4 min-h-[300px] border rounded-md flex items-center justify-center">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

// Main BlogPostTable Component
export default function BlogPostTable() {
  const { data } = useGetAllPosts()
  const [editorContent, setEditorContent] = React.useState<unknown>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Start writing your content here...'
          }
        ]
      }
    ]
  })

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
        blog_post_title: postData.data.blog_post_title,
        blog_post_description: postData.data.blog_post_description,
        blog_post_image_url: postData.data.blog_post_image_url,
        blog_post_status: postData.data.blog_post_status
      })
      setEditorContent(
        postData.data.blog_post_content || {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Start writing your content here...'
                }
              ]
            }
          ]
        }
      )
    } else {
      form.reset({
        blog_post_title: '',
        blog_post_description: '',
        blog_post_image_url: '',
        blog_post_status: 'save'
      })
      setEditorContent({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Start writing your content here...'
              }
            ]
          }
        ]
      })
    }
  }, [postData, form])

  React.useEffect(() => {
    if (!isDialogOpen) {
      setEditingPost(null)
      setEditorContent({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Start writing your content here...'
              }
            ]
          }
        ]
      })
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
    // Ensure we have valid content structure
    const contentToSend =
      editorContent && editorContent.content
        ? editorContent
        : {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Empty content'
                  }
                ]
              }
            ]
          }

    const payload = {
      data: {
        blog_post_title: values.blog_post_title,
        blog_post_description: values.blog_post_description,
        blog_post_content: contentToSend,
        blog_post_image_url: values.blog_post_image_url,
        blog_post_status: values.blog_post_status
      }
    }

    if (editingPost) {
      updateMutation.mutate(
        { id: editingPost.documentId, payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            setEditingPost(null)
            toast.success('Post updated successfully')
          },
          onError: () => {
            toast.error('Failed to update post')
          }
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false)
          toast.success('Post created successfully')
        },
        onError: (error: unknown) => {
          console.error('Create post error:', error)
          toast.error('Failed to create post')
        }
      })
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
                  <FormField
                    control={form.control}
                    name="blog_post_title"
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
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
                      <FormItem>
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
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <TiptapEditor
                      initialContent={editorContent}
                      onContentChange={setEditorContent}
                    />
                  </FormItem>

                  <div className="flex justify-end gap-2">
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
