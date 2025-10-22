'use client'

import { useState } from 'react'
import MarkdownConverter from '../components/MarkdownConverter'

export default function Home() {
    return (
        <main className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>MD to DOCX Converter</h1>
            <MarkdownConverter />
        </main>
    )
}