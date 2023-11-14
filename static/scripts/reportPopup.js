document.getElementById("open-form-btn").addEventListener('click', () => {
    document.getElementById("popupForm").style.display = 'block';
});

document.addEventListener('click', function (event) {
    const popupForm = document.getElementById('popupForm');

    if (!event.target.closest('#popupForm') && !event.target.closest('#open-form-btn')) {
        popupForm.style.display = 'none';
    }
});
