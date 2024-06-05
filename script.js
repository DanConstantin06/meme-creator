document.addEventListener('DOMContentLoaded', () => {
    fetchDirectory('/images');

    const characterContainer = document.getElementById('character-container');
    const resetBtn = document.getElementById('reset-btn');
    const randomBtn = document.getElementById('random-btn');
    const saveBtn = document.getElementById('save-btn');

    function fetchDirectory(directoryPath) {
        fetch(directoryPath)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const items = doc.querySelectorAll('a');
                const categoryFolders = Array.from(items).filter(item => item.href.endsWith('/'));
                Promise.all(categoryFolders.map(folder => fetchCategory(folder.href))).then(categories => {
                    renderCategories(categories);
                    randomBtn.addEventListener('click', () => {
                        applyRandomItems(categories);
                    });
                });
            });
    }

    function fetchCategory(categoryPath) {
        return fetch(categoryPath)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const items = doc.querySelectorAll('a');
                const itemPaths = Array.from(items)
                    .filter(item => item.href.endsWith('.png') || item.href.endsWith('.jpg'))
                    .map(item => item.href.split('/').pop());
                return {
                    category: categoryPath.split('/').filter(Boolean).pop(),
                    items: itemPaths
                };
            });
    }

    function renderCategories(categories) {
        const categoriesContainer = document.getElementById('categories-container');
        categoriesContainer.innerHTML = '';

        const backgroundCategory = categories.find(category => category.category === 'background');
        if (backgroundCategory) {
            renderCategory(backgroundCategory, 0);
        }

        const skinsCategory = categories.find(category => category.category === 'skins');
        if (skinsCategory) {
            renderCategory(skinsCategory, 1);
        }

        categories.forEach(categoryData => {
            const { category } = categoryData;
            if (category !== 'background' && category !== 'skins' && category !== 'mouth' && category !== 'hat' && category !== 'necklace') {
                renderCategory(categoryData, 1); // Default items with index 1 (same as skins)
            }
        });

        const mouthCategory = categories.find(category => category.category === 'mouth');
        if (mouthCategory) {
            renderCategory(mouthCategory, 3);
        }

        const hatCategory = categories.find(category => category.category === 'hat');
        if (hatCategory) {
            renderCategory(hatCategory, 2);
        }

        const necklaceCategory = categories.find(category => category.category === 'necklace');
        if (necklaceCategory) {
            renderCategory(necklaceCategory, 2);
        }
    }

    function renderCategory(categoryData, zIndex) {
        const { category, items } = categoryData;

        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.dataset.index = zIndex;

        const title = document.createElement('h3');
        title.innerText = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        categoryDiv.appendChild(title);

        const itemsDiv = document.createElement('div');
        itemsDiv.classList.add('items');

        items.forEach(item => {
            const itemImg = document.createElement('img');
            itemImg.src = `images/${category}/${item}`;
            itemImg.classList.add('item');
            itemImg.setAttribute('data-category', category);
            itemImg.setAttribute('data-item', item);
            itemImg.style.zIndex = zIndex;
            itemImg.addEventListener('click', () => applyItem(category, itemImg.src, zIndex));

            itemsDiv.appendChild(itemImg);
        });

        categoryDiv.appendChild(itemsDiv);
        document.getElementById('categories-container').appendChild(categoryDiv);
    }

    function applyItem(category, src, zIndex) {
        // Remove previously applied items from the same category
        document.querySelectorAll(`.applied-item[data-category="${category}"]`).forEach(item => item.remove());

        const newItem = document.createElement('img');
        newItem.src = src;
        newItem.setAttribute('data-category', category);
        newItem.classList.add('applied-item');
        newItem.style.zIndex = zIndex;
        characterContainer.appendChild(newItem);
    }

    function applyRandomItems(categories) {
        // Clear previous items
        document.querySelectorAll('.applied-item').forEach(item => item.remove());

        let skinSelected = false;

        categories.forEach(categoryData => {
            const { category, items } = categoryData;
            if (items.length > 0) {
                const randomItemIndex = Math.floor(Math.random() * items.length);
                const selectedItem = items[randomItemIndex];
                let zIndex;
                switch (category) {
                    case 'background':
                        zIndex = 0;
                        break;
                    case 'skins':
                        zIndex = 1;
                        skinSelected = true;
                        break;
                    case 'hat':
                    case 'necklace':
                        zIndex = 2;
                        break;
                    case 'mouth':
                        zIndex = 3;
                        break;
                    default:
                        zIndex = 1;
                        break;
                }
                applyItem(category, `images/${category}/${selectedItem}`, zIndex);
            }
        });

        // If no skin is selected, apply the first skin item as default
        if (!skinSelected) {
            const skinsCategory = categories.find(category => category.category === 'skins');
            if (skinsCategory && skinsCategory.items.length > 0) {
                const firstSkinItem = skinsCategory.items[0];
                applyItem('skins', `images/skins/${firstSkinItem}`, 1);
            }
        }
    }

    resetBtn.addEventListener('click', () => {
        document.querySelectorAll('.applied-item').forEach(item => item.remove());
    });

    saveBtn.addEventListener('click', () => {
        html2canvas(characterContainer).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'My-COFFEE.png';
            link.click();
        });
    });
});