export function extractUrlImg(imgString: string): string {

  const regex = /<img.*?src="(.*?)"/;
  const match = imgString.match(regex);
  console.log({ regex })
  console.log({ match })
  if (match && match[1]) {
    const url = match[1];

    return url
  }

  return ""
}