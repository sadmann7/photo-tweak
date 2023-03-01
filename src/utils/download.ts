export const downloadFile = (
  url: string,
  filename: string,
  setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsDownloading(true);
  fetch(url, {
    headers: new Headers({
      Origin: location.origin,
    }),
    mode: "cors",
  })
    .then((response) =>
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = filename;
        alink.click();
        alink.remove();
        setIsDownloading(false);
      })
    )
    .catch((e) => console.error(e));
};
