'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useGetPostById } from '@/services/query/posts/post'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Eye, 
  Share, 
  MessageSquare, 
  Heart, 
  Calendar, 
  User,
  ArrowLeft,
  Bookmark,
  BookmarkCheck
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

// Enhanced Content renderer component for Quill format
function ContentRenderer({ content }: { content: any }) {
  if (!content) return <p className="text-muted-foreground">No content available.</p>
  
  // Handle string content (fallback)
  if (typeof content === 'string') {
    return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  }
  
  // Handle array content (Quill delta format)
  if (Array.isArray(content)) {
    return (
      <div className="prose prose-lg max-w-none">
        {content.map((item, index) => {
          if (item.type === 'paragraph') {
            return (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.children?.map((child: any, childIndex: number) => {
                  let element = child.text || ''
                  
                  if (child.bold) {
                    element = <strong key={childIndex} className="font-bold text-gray-900 dark:text-white">{element}</strong>
                  }
                  if (child.italic) {
                    element = <em key={childIndex} className="italic">{element}</em>
                  }
                  if (child.underline) {
                    element = <u key={childIndex} className="underline">{element}</u>
                  }
                  
                  return element
                })}
              </p>
            )
          }
          
          // Add support for other element types as needed
          if (item.type === 'header' && item.level) {
            const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements
            const headingClasses = [
              'font-bold tracking-tight mb-4 mt-8',
              item.level === 1 ? 'text-3xl' : 
              item.level === 2 ? 'text-2xl' : 
              'text-xl'
            ].join(' ')
            
            return (
              <HeadingTag key={index} className={headingClasses}>
                {item.children?.map((child: any) => child.text || '').join('')}
              </HeadingTag>
            )
          }
          
          if (item.type === 'list' && item.children) {
            const ListTag = item.format === 'ordered' ? 'ol' : 'ul'
            const listClasses = item.format === 'ordered' 
              ? 'list-decimal ml-6 mb-4' 
              : 'list-disc ml-6 mb-4'
              
            return (
              <ListTag key={index} className={listClasses}>
                {item.children.map((listItem: any, listIndex: number) => (
                  <li key={listIndex} className="mb-1 text-gray-700 dark:text-gray-300">
                    {listItem.children?.map((child: any) => child.text || '').join('')}
                  </li>
                ))}
              </ListTag>
            )
          }
          
          if (item.type === 'blockquote') {
            return (
              <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6 py-2 bg-gray-50 dark:bg-gray-800 rounded-r">
                {item.children?.map((child: any) => child.text || '').join('')}
              </blockquote>
            )
          }
          
          return null
        })}
      </div>
    )
  }
  
  return <p className="text-muted-foreground">Unsupported content format.</p>
}

// Loading fallback component
function BlogPostViewFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-6 rounded-xl" />
          <Skeleton className="h-6 w-1/2 mb-8 rounded-xl" />
          
          {/* Image skeleton with shimmer effect */}
          <div className="relative overflow-hidden rounded-2xl mb-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-1/2 rounded-xl" />
          </div>
          
          <div className="mt-8 flex gap-4">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Main content component that uses searchParams
function BlogPostViewContent() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get('documentId')
  const { data: postData, isLoading, error } = useGetPostById(documentId || '')

  const [likes, setLikes] = React.useState(42)
  const [comments, setComments] = React.useState(15)
  const [views, setViews] = React.useState(128)
  const [isLiked, setIsLiked] = React.useState(false)
  const [isBookmarked, setIsBookmarked] = React.useState(false)

  const post = postData?.data?.data

  React.useEffect(() => {
    // Simulate view count increment
    if (post) {
      setViews(prev => prev + 1)
    }
  }, [post])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error loading blog post</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Please try again later</p>
            <Button asChild className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Link href="/dashboard">
                Go Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <BlogPostViewFallback />
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Blog post not found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">The post you're looking for doesn't exist</p>
            <Button asChild className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Link href="/dashboard">
                Go Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1)
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.blog_post_title,
          text: post.blog_post_description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Show a toast notification instead of alert
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity opacity-0'
      toast.textContent = 'Link copied to clipboard!'
      document.body.appendChild(toast)
      
      // Animate in
      setTimeout(() => toast.classList.add('opacity-100'), 10)
      
      // Animate out and remove
      setTimeout(() => {
        toast.classList.remove('opacity-100')
        setTimeout(() => document.body.removeChild(toast), 300)
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Button variant="ghost" asChild className="mb-6 group rounded-full pl-2 pr-4 transition-all duration-300 hover:bg-white/80 hover:shadow-sm backdrop-blur-sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Featured Image */}
          {post.blog_post_image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl">
              <img
                src={post.blog_post_image_url}
                alt={post.blog_post_title}
                className="w-full h-96 object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="mb-8 p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-sm">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {post.blog_post_title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.blog_post_description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </div>
              
              {post.domains && post.domains.length > 0 && (
                <Badge variant="secondary" className="rounded-full px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600">
                  {post.domains[0].domain_name}
                </Badge>
              )}
              
              {post.categories && post.categories.length > 0 && (
                <Badge variant="outline" className="rounded-full px-3 py-1 border-indigo-300 text-indigo-600 dark:text-indigo-400">
                  {post.categories[0].category_name}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Eye className="h-5 w-5" />
              <span className="font-medium">{views} views</span>
            </div>
            
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="gap-2 rounded-full transition-all duration-300"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {likes} likes
            </Button>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">{comments} comments</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="ml-auto gap-2 rounded-full"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-indigo-500 fill-current" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="pt-8 pb-10 px-6 md:px-8">
            <ContentRenderer content={post.blog_post_content} />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8 flex gap-4 flex-wrap">
          <Button 
            onClick={handleLike} 
            variant={isLiked ? "default" : "outline"} 
            className="gap-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like'}
          </Button>
          
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="gap-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>

          <Button 
            variant="outline" 
            className="gap-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            <MessageSquare className="h-4 w-4" />
            Comment
          </Button>
        </div>

        {/* Comments Section */}
        <Card className="max-w-4xl mx-auto mt-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Comments ({comments})
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((comment) => (
                <div key={comment} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">User {comment}</span>
                        <span className="text-sm text-muted-foreground">
                          {comment} hour{comment > 1 ? 's' : ''} ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        This is a sample comment. The blog post is very informative and well-written!
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <button className="text-xs text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          Like
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add comment form */}
              <div className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <textarea 
                      placeholder="Add a comment..." 
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main exported component with Suspense boundary
export default function BlogPostViewPage() {
  return (
    <Suspense fallback={<BlogPostViewFallback />}>
      <BlogPostViewContent />
    </Suspense>
  )
}