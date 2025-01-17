const externalImageUrls: string[] = [];

/**
 * Fetches image URLs for a specific mod, including nested directories.
 * Stores the fetched URLs in the `externalImageUrls` array.
 * @param modId - The ID of the mod whose images need to be fetched.
 * @returns A Promise that resolves to the fetched image URLs.
 */
const fetchModImages = async (modId: string): Promise<string[]> => {
  const baseUrl = import.meta.env.VITE_MOD_URL + modId;

  const fetchDirectory = async (url: string): Promise<void> => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Failed to fetch directory contents: ${response.statusText}`
        );
        return;
      }

      const data = await response.json();

      for (const item of data) {
        if (item.type === "file" && /\.(png|jpg)$/i.test(item.name)) {
          externalImageUrls.push(item.download_url);
        } else if (item.type === "dir") {
          await fetchDirectory(item.url);
        }
      }
    } catch (error) {
      console.error(`Error fetching directory contents: ${error}`);
    }
  };

  // Clear the array before fetching to avoid duplicates
  externalImageUrls.length = 0;

  await fetchDirectory(baseUrl);

  return externalImageUrls;
};

export { fetchModImages };
