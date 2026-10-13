export function formatDate(dateString: string): string {
  const createdDate = new Date(dateString);

  return createdDate.toLocaleDateString("en-GB");
}

const maximumPreviewLength = 150;

export function createContentPreview(text: string): string {
  if (text.length <= maximumPreviewLength) {
    return text;
  }

  return text.slice(0, maximumPreviewLength) + "...";
}
