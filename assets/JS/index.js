document.addEventListener('DOMContentLoaded', () => {
  let cardsData = [];
  let tagsData = [];
  const classCardsContainer = document.querySelector('.class-cards');

  let jsonPathPrefix = '';
  const currentPath = window.location.pathname;

  if (currentPath.includes('/A/') || currentPath.includes('/B/')) {
    jsonPathPrefix = '../';
  }

  Promise.all([
    fetch(`${jsonPathPrefix}Json/card.json`).then(res => {
      if (!res.ok) throw new Error(`Không tìm thấy file card.json (${res.status})`);
      return res.json();
    }),
    fetch(`${jsonPathPrefix}Json/tags.json`).then(res => {
      if (!res.ok) throw new Error(`Không tìm thấy file tags.json (${res.status})`);
      return res.json();
    })
  ])
  .then(([cards, tags]) => {
    cardsData = cards;
    tagsData = tags;
    renderCards('Y1');
  })
  .catch(error => console.error('Lỗi tải dữ liệu:', error));

  function renderCards(selectedTag) {
    classCardsContainer.innerHTML = '';

    const filteredCards = cardsData.filter(card => {
      const tag = tagsData.find(t => t.id === card.id);
      return tag && tag.tag === selectedTag;
    });

    filteredCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'class-card';

      let folder = '';
      if (currentPath.includes('/A/')) {
        folder = 'A/';
      } else if (currentPath.includes('/B/')) {
        folder = 'B/';
      }

      const cardLink = `${jsonPathPrefix}${folder}${selectedTag}/${card.slug}/${card.slug}_index.html`;

      cardElement.onclick = () => window.location.href = cardLink;

      cardElement.innerHTML = `
        <img src="${card.image}" alt="${card.name}" class="card-image">
        <h3>${card.name}</h3>
        <p>Giáo sư: ${card.professor}</p>
      `;

      classCardsContainer.appendChild(cardElement);
    });
  }

  const sliderButton = document.querySelector('.slider-button');
  const year1Label = document.querySelector('.year1-label');
  const year2Label = document.querySelector('.year2-label');
  const year1Icon = document.querySelector('.year1-icon');
  const year2Icon = document.querySelector('.year2-icon');

  let isYear1 = true;

  sliderButton.addEventListener('click', () => {
    if (isYear1) {
      year1Label.classList.remove('active');
      year1Icon.classList.remove('active');
    } else {
      year2Label.classList.remove('active');
      year2Icon.classList.remove('active');
    }

    setTimeout(() => {
      if (isYear1) {
        sliderButton.style.left = 'calc(100% - 48px)';
      } else {
        sliderButton.style.left = '2px';
      }

      setTimeout(() => {
        if (isYear1) {
          year2Label.classList.add('active');
          year2Icon.classList.add('active');
        } else {
          year1Label.classList.add('active');
          year1Icon.classList.add('active');
        }

        // 💥 Thêm đoạn gọi renderCards:
        const selectedTag = isYear1 ? 'Y2' : 'Y1';
        renderCards(selectedTag);

        isYear1 = !isYear1;
      }, 300);
    }, 100);
  });
});
