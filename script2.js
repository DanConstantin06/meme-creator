const characterContainer = document.getElementById('character-container');
const items = document.querySelectorAll('.item');
const saveBtn = document.getElementById('save-btn');

// Define the positions and sizes for each category
const positions = {
    hats: { top: '50px', left: '75px', width: '150px', height: 'auto' },
    glasses: { top: '150px', left: '100px', width: '100px', height: 'auto' }
    // Define positions for other categories as needed
};

items.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        const itemId = item.getAttribute('data-item');
        
        // Remove any existing item from the same category
        let existingItem = document.querySelector(`#character-container img[data-category="${category}"]`);
        if (existingItem) {
            existingItem.remove();
        }

        // Add the new item
        const newItem = document.createElement('img');
        newItem.src = item.src;
        newItem.setAttribute('data-category', category);
        newItem.classList.add('applied-item');
        
        // Set the position and size based on category
        newItem.style.top = positions[category].top;
        newItem.style.left = positions[category].left;
        newItem.style.width = positions[category].width;
        newItem.style.height = positions[category].height;
        
        characterContainer.appendChild(newItem);
    });
});

saveBtn.addEventListener('click', () => {
    html2canvas(characterContainer).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'my-character.png';
        link.click();
    });
});
