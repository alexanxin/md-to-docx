import './globals.css'

export const metadata = {
    title: 'MD to DOCX Converter',
    description: 'Convert Markdown files to DOCX format',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#000000" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <meta name="apple-mobile-web-app-title" content="MD to DOCX" />
                <link rel="apple-touch-icon" href="/android-launchericon-192-192.png" />
            </head>
            <body>
                {children}
                <script>
                    {`
                        if ('serviceWorker' in navigator) {
                            window.addEventListener('load', function() {
                                navigator.serviceWorker.register('/sw.js')
                                    .then(function(registration) {
                                        console.log('SW registered: ', registration);
                                    })
                                    .catch(function(registrationError) {
                                        console.log('SW registration failed: ', registrationError);
                                    });
                            });
                        }
                    `}
                </script>
            </body>
        </html>
    )
}