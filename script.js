class ResumeUploader {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.resumeDisplay = document.getElementById('resumeDisplay');
        this.resumeFrame = document.getElementById('resumeFrame');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.replaceBtn = document.getElementById('replaceBtn');
        
        this.currentFile = null;
        this.initializeEventListeners();
        this.checkExistingResume();
    }

    initializeEventListeners() {
        // Upload area click
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            this.handleFileSelect(file);
        });

        // Upload button
        this.uploadBtn.addEventListener('click', () => {
            this.uploadResume();
        });

        // Download button
        this.downloadBtn.addEventListener('click', () => {
            this.downloadResume();
        });

        // Replace button
        this.replaceBtn.addEventListener('click', () => {
            this.showUploadSection();
        });
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a PDF or Word document.');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }

        this.currentFile = file;
        this.fileName.textContent = file.name;
        this.fileInfo.style.display = 'block';
    }

    uploadResume() {
        if (!this.currentFile) return;

        // Simulate upload process
        this.uploadBtn.textContent = 'Uploading...';
        this.uploadBtn.disabled = true;

        // Store file in localStorage (for demo purposes)
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = {
                name: this.currentFile.name,
                type: this.currentFile.type,
                data: e.target.result,
                uploadDate: new Date().toISOString()
            };
            
            localStorage.setItem('resume', JSON.stringify(fileData));
            
            setTimeout(() => {
                this.uploadBtn.textContent = 'Upload Resume';
                this.uploadBtn.disabled = false;
                this.showResumeDisplay();
                this.showSuccessMessage();
            }, 1500);
        };
        
        reader.readAsDataURL(this.currentFile);
    }

    showResumeDisplay() {
        const storedResume = localStorage.getItem('resume');
        if (!storedResume) return;

        const resumeData = JSON.parse(storedResume);
        
        // Hide upload section and show resume display
        document.querySelector('.upload-section').style.display = 'none';
        this.resumeDisplay.style.display = 'block';

        // Display PDF in iframe if it's a PDF
        if (resumeData.type === 'application/pdf') {
            this.resumeFrame.src = resumeData.data;
        } else {
            // For Word documents, show a message
            this.resumeFrame.style.display = 'none';
            const preview = document.querySelector('.resume-preview');
            preview.innerHTML = `
                <div style="text-align: center; padding: 40px; background-color: #f7fafc; border-radius: 5px;">
                    <div style="font-size: 3em; margin-bottom: 15px;">📄</div>
                    <h3>${resumeData.name}</h3>
                    <p style="color: #718096; margin-top: 10px;">Word document uploaded successfully</p>
                    <p style="color: #718096; font-size: 0.9em;">Uploaded on ${new Date(resumeData.uploadDate).toLocaleDateString()}</p>
                </div>
            `;
        }
    }

    showUploadSection() {
        document.querySelector('.upload-section').style.display = 'block';
        this.resumeDisplay.style.display = 'none';
        this.fileInfo.style.display = 'none';
        this.fileInput.value = '';
        this.currentFile = null;
    }

    downloadResume() {
        const storedResume = localStorage.getItem('resume');
        if (!storedResume) return;

        const resumeData = JSON.parse(storedResume);
        
        // Create download link
        const link = document.createElement('a');
        link.href = resumeData.data;
        link.download = resumeData.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    checkExistingResume() {
        const storedResume = localStorage.getItem('resume');
        if (storedResume) {
            this.showResumeDisplay();
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        `;
        message.textContent = 'Resume uploaded successfully!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
}

// Initialize the resume uploader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeUploader();
});