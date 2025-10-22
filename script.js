// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const mdFileInput = document.getElementById('mdFile');
    const convertBtn = document.getElementById('convertBtn');
    const previewDiv = document.getElementById('preview');
    const statusDiv = document.getElementById('status');

    // Variable to store markdown content
    let markdownContent = '';

    // Handle file selection
    mdFileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            processFile(file);
        }
    });

    // Function to process a file (for both regular upload and file sharing)
    function processFile(file) {
        // Check if the file is a markdown file
        if (file.type === 'text/markdown' || file.type === 'text/x-markdown' ||
            file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.markdown')) {

            // Read the file content
            const reader = new FileReader();

            reader.onload = function (e) {
                markdownContent = e.target.result;

                // Show preview using markdown-it for basic rendering
                const md = window.markdownit({
                    html: true,
                    linkify: true,
                    typographer: true
                });

                previewDiv.innerHTML = md.render(markdownContent);

                // Enable convert button
                convertBtn.disabled = false;
                statusDiv.textContent = '';
            };

            reader.onerror = function () {
                statusDiv.textContent = 'Error reading file';
                statusDiv.className = 'status-message error';
            };

            reader.readAsText(file);
        } else {
            statusDiv.textContent = 'Please select a valid markdown file (.md or .markdown)';
            statusDiv.className = 'status-message error';
            convertBtn.disabled = true;
        }
    }

    // Handle file handling from mobile sharing (Web Share Target API)
    if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
        window.launchQueue.setConsumer((launchParams) => {
            if (launchParams.files && launchParams.files.length > 0) {
                const file = launchParams.files[0];
                processFile(file);
            }
        });
    }

    // Handle conversion to DOCX
    convertBtn.addEventListener('click', function () {
        if (!markdownContent) {
            statusDiv.textContent = 'No markdown content to convert';
            statusDiv.className = 'status-message error';
            return;
        }

        try {
            statusDiv.textContent = 'Converting...';
            statusDiv.className = 'status-message';

            // Convert markdown to DOCX using the markdown-docx library
            const markdownDocx = window.markdownDocx;
            const docxBlob = markdownDocx(markdownContent);

            // Create a download link
            const downloadUrl = URL.createObjectURL(docxBlob);
            const fileName = getFileNameWithoutExtension(mdFileInput.files[0].name) + '.docx';

            // Create temporary link and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            statusDiv.textContent = 'Conversion successful! Download started.';
            statusDiv.className = 'status-message success';
        } catch (error) {
            console.error('Conversion error:', error);
            statusDiv.textContent = 'Conversion failed: ' + error.message;
            statusDiv.className = 'status-message error';
        }
    });

    // Helper function to get file name without extension
    function getFileNameWithoutExtension(fileName) {
        return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    }
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js')
            .then(function (registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function (error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}