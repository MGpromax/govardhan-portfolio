    const members = ['govardhan', 'gowtham', 'varun', 'gahan', 'pruthvi', 'likhith'];
    
    // Initialize gallery buttons
    initGalleryButtons();
    
    // Initialize PFP upload buttons and click handlers
    initPFPUploads();
    
    // Initialize PFP popup
    initPFPPopup();
    
    // Initialize old gallery upload buttons (for gallery photos/videos)
    members.forEach(member => {
        // Photo upload (for gallery) - using Cloudinary
        const photoBtn = document.querySelector(`.upload-photo[data-member="${member}"]`);
        if (photoBtn) {
            photoBtn.addEventListener('click', () => {
                if (isAdmin) {
                    openCloudinaryUpload(member, 'photos');
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }

        // Video upload (for gallery) - using Cloudinary
        const videoBtn = document.querySelector(`.upload-video[data-member="${member}"]`);
        if (videoBtn) {
            videoBtn.addEventListener('click', () => {
                if (isAdmin) {
                    openCloudinaryUpload(member, 'videos');
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }

        // Music upload - using Cloudinary
        const musicBtn = document.querySelector(`.upload-music[data-member="${member}"]`);
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                if (isAdmin) {
                    openCloudinaryUpload(member, 'music');
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }
    });

