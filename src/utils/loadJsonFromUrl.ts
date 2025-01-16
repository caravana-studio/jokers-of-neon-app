export const getJsonFromUrl = async (url: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch specials.json: ${response.statusText}`);
      return;
    }

    const data = await response.json();

    if (data.encoding === "base64") {
      const content = JSON.parse(atob(data.content));
      return content;
    } else {
      console.error("Unexpected encoding format:", data.encoding);
    }
  } catch (error) {
    console.error("Error fetching specials.json:", error);
  }
};
