// components/QuillEditor.tsx
'use client'

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export type QuillEditorHandle = {
  getContent: () => unknown
  getHTML: () => string
}

interface QuillEditorProps {
  initialContent?: unknown
  onContentChange?: (content: unknown) => void
}

const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(
  ({ initialContent = null, onContentChange }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)
    const isInitializedRef = useRef(false)
    const ignoreNextChangeRef = useRef(false)

    // Memoize the onContentChange callback to prevent unnecessary re-renders
    const onContentChangeRef = useRef(onContentChange)
    useEffect(() => {
      onContentChangeRef.current = onContentChange
    }, [onContentChange])

    // Function to convert Quill delta to structured format
    const convertDeltaToStructuredFormat = useCallback((delta: unknown) => {
      if (!delta || !delta.ops) return []

      const structuredContent: unknown[] = []
      let currentBlock: unknown = null

      delta.ops.forEach((op: unknown) => {
        if (typeof op.insert === 'string') {
          // Handle text insertion
          if (op.insert === '\n') {
            // End of paragraph/block
            if (currentBlock) {
              structuredContent.push(currentBlock)
              currentBlock = null
            }
          } else {
            // Add text to current block
            if (!currentBlock) {
              currentBlock = {
                type: 'paragraph',
                children: []
              }
            }

            const textNode: unknown = {
              type: 'text',
              text: op.insert
            }

            // Apply formatting attributes
            if (op.attributes) {
              if (op.attributes.bold) textNode.bold = true
              if (op.attributes.italic) textNode.italic = true
              if (op.attributes.underline) textNode.underline = true
              if (op.attributes.strike) textNode.strikethrough = true
              if (op.attributes.code) textNode.code = true
            }

            currentBlock.children.push(textNode)
          }
        } else if (typeof op.insert === 'object') {
          // Handle embedded content (images, etc.)
          if (op.insert.image) {
            // Create a new paragraph for the image
            structuredContent.push({
              type: 'paragraph',
              children: [
                {
                  type: 'image',
                  src: op.insert.image,
                  alt: ''
                }
              ]
            })
          }
        }
      })

      // Add the last block if it exists
      if (currentBlock) {
        structuredContent.push(currentBlock)
      }

      return structuredContent
    }, [])

    // Function to convert structured format to Quill delta
    const convertStructuredToDelta = useCallback((structuredContent: unknown[]) => {
      if (!structuredContent || !Array.isArray(structuredContent)) return { ops: [] }

      const deltaOps: unknown[] = []

      structuredContent.forEach((block, index) => {
        if (index > 0) {
          // Add newline between blocks
          deltaOps.push({ insert: '\n' })
        }

        if (block.type === 'paragraph') {
          block.children.forEach((child: unknown) => {
            if (child.type === 'text') {
              const attributes: unknown = {}
              if (child.bold) attributes.bold = true
              if (child.italic) attributes.italic = true
              if (child.underline) attributes.underline = true
              if (child.strikethrough) attributes.strike = true
              if (child.code) attributes.code = true

              deltaOps.push({
                insert: child.text,
                attributes: Object.keys(attributes).length > 0 ? attributes : undefined
              })
            } else if (child.type === 'image') {
              deltaOps.push({
                insert: { image: child.src }
              })
            }
          })
        } else if (block.type === 'heading') {
          // Handle headings
          const attributes = { header: block.level || 1 }

          block.children.forEach((child: unknown) => {
            if (child.type === 'text') {
              deltaOps.push({
                insert: child.text,
                attributes
              })
            }
          })
        }
      })

      return { ops: deltaOps }
    }, [])

    // Initialize Quill editor
    useEffect(() => {
      if (editorRef.current && !isInitializedRef.current) {
        isInitializedRef.current = true

        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean']
            ]
          },
          placeholder: 'Write your post content here...'
        })

        // Set initial content if provided
        if (initialContent) {
          ignoreNextChangeRef.current = true
          try {
            // Convert structured format to delta for Quill
            const delta = convertStructuredToDelta(initialContent)
            quillRef.current.setContents(delta)
          } catch (error) {
            console.error('Error setting initial content:', error)
          }
        }

        // Add event listener for content changes
        quillRef.current.on('text-change', () => {
          if (ignoreNextChangeRef.current) {
            ignoreNextChangeRef.current = false
            return
          }

          if (onContentChangeRef.current && quillRef.current) {
            // Get the content in delta format and convert to structured format
            const delta = quillRef.current.getContents()
            const structuredContent = convertDeltaToStructuredFormat(delta)
            onContentChangeRef.current(structuredContent)
          }
        })
      }

      return () => {
        if (quillRef.current) {
          quillRef.current = null
        }
        isInitializedRef.current = false
      }
    }, []) // Empty dependency array to run only once

    // Update content when initialContent changes (from external source)
    useEffect(() => {
      if (quillRef.current && initialContent && isInitializedRef.current) {
        // Compare current content with new content to avoid unnecessary updates
        const currentDelta = quillRef.current.getContents()
        const currentStructured = convertDeltaToStructuredFormat(currentDelta)
        const isContentDifferent =
          JSON.stringify(currentStructured) !== JSON.stringify(initialContent)

        if (isContentDifferent) {
          ignoreNextChangeRef.current = true
          try {
            // Preserve cursor position
            const selection = quillRef.current.getSelection()
            const delta = convertStructuredToDelta(initialContent)
            quillRef.current.setContents(delta)

            // Restore cursor position if it existed
            if (selection) {
              setTimeout(() => {
                quillRef.current?.setSelection(selection)
              }, 0)
            }
          } catch (error) {
            console.error('Error updating content:', error)
          }
        }
      }
    }, [initialContent, convertDeltaToStructuredFormat, convertStructuredToDelta])

    // Expose functions to the parent component
    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          const delta = quillRef.current.getContents()
          return convertDeltaToStructuredFormat(delta)
        }
        return null
      },
      getHTML: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML
        }
        return ''
      }
    }))

    return <div ref={editorRef} style={{ height: '300px' }} />
  }
)

QuillEditor.displayName = 'QuillEditor'
export default QuillEditor
