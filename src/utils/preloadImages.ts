export const preloadImages = () => {
  const imageUrls: string[] = [];

  //traditional cards
  for (let i = 0; i < 52; i++) {
    imageUrls.push(`Cards/${i}.png`);
  }

  //effect cards
  for (let i = 1; i < 29; i++) {
    imageUrls.push(`Cards/effect/${i}.png`);
  }

  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  return Promise.all(promises);
};
