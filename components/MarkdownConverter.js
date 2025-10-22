'use client'

import { useState, useRef, useEffect } from 'react'
import { convertMarkdownToDocx } from '@mohtasham/md-to-docx'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
})

console.log('MarkdownConverter component loaded')
console.log('convertMarkdownToDocx function:', typeof convertMarkdownToDocx)
console.log('MarkdownIt instance:', md)

export default function MarkdownConverter() {
    console.log('MarkdownConverter component rendered')

    const [markdownContent, setMarkdownContent] = useState('')
    const [status, setStatus] = useState('')
    const [statusType, setStatusType] = useState('')
    const fileInputRef = useRef(null)

    useEffect(() => {
        console.log('Component mounted, markdownContent:', markdownContent)
    }, [markdownContent])

    const handleFileChange = async (e) => {
        console.log('File input changed:', e.target.files)
        const file = e.target.files[0]
        console.log('Selected file:', file)

        if (!file) {
            console.log('No file selected')
            return
        }

        console.log('File type:', file.type)
        console.log('File name:', file.name)

        if (file.type === 'text/markdown' || file.type === 'text/x-markdown' ||
            file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.markdown')) {

            console.log('Valid markdown file detected, reading content...')
            setStatus('Reading file...')
            setStatusType('')

            const reader = new FileReader()
            reader.onload = (e) => {
                console.log('File read successfully, content length:', e.target.result.length)
                const content = e.target.result
                setMarkdownContent(content)
                setStatus('File loaded successfully')
                setStatusType('success')
                console.log('Markdown content set, preview should appear')
            }
            reader.onerror = () => {
                console.error('FileReader error')
                setStatus('Error reading file')
                setStatusType('error')
            }
            reader.readAsText(file)
        } else {
            console.log('Invalid file type')
            setStatus('Please select a valid markdown file (.md or .markdown)')
            setStatusType('error')
        }
    }

    const handleConvert = async () => {
        console.log('Convert button clicked')
        console.log('Markdown content length:', markdownContent?.length)

        if (!markdownContent) {
            console.log('No markdown content available')
            setStatus('No markdown content to convert')
            setStatusType('error')
            return
        }

        try {
            console.log('Starting conversion...')
            setStatus('Converting...')
            setStatusType('')

            console.log('Calling convertMarkdownToDocx...')
            const docxBlob = await convertMarkdownToDocx(markdownContent)
            console.log('Conversion completed, blob size:', docxBlob.size)

            // Create download link
            const downloadUrl = URL.createObjectURL(docxBlob)
            console.log('Created download URL:', downloadUrl)

            const fileName = fileInputRef.current?.files[0]
                ? fileInputRef.current.files[0].name.replace(/\.[^/.]+$/, "") + '.docx'
                : 'converted.docx'
            console.log('Download filename:', fileName)

            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)

            console.log('Download initiated successfully')
            setStatus('Conversion successful! Download started.')
            setStatusType('success')
        } catch (error) {
            console.error('Conversion error:', error)
            console.error('Error details:', error.stack)
            setStatus('Conversion failed: ' + error.message)
            setStatusType('error')
        }

    }
    return (
        <div>
            <div className="preview-section">

                <div
                    className="preview-content"
                    dangerouslySetInnerHTML={{
                        __html: markdownContent ? md.render(markdownContent) : '<p style="color: #b0b0b0; font-style: italic;">Select a markdown file to see the preview here...</p>'
                    }}
                />
            </div>

            <div className="action-section" style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        id="mdFile"
                        accept=".md,.markdown"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="mdFile" className="file-input-label">
                        Choose Markdown File
                    </label>
                </div>

                <button
                    id="convertBtn"
                    className="convert-btn"
                    onClick={handleConvert}
                    disabled={!markdownContent}
                >
                    Convert to DOCX
                </button>
            </div>

            {!markdownContent && (
                <p className="file-hint" style={{ textAlign: 'center', marginTop: '10px' }}>
                    Select a .md or .markdown file to convert
                </p>
            )}

            {status && (
                <div className={`status-message ${statusType}`}>
                    {status}
                </div>
            )}
        </div>
    )
}