import path from "path";

export const downloadImage = (req, res) => {
  console.log(req.params);
  const location = req.params.folder;
  const filename = req.params.name;
  const imagePath = path.join(appRoot, "/storage/", location, filename);
  res.download(imagePath);
};
export const downloadQueueReport = (req, res) => {
  console.log(req.params);
  const filename = req.params.name;
  const imagePath = path.join(appRoot, "/storage/reports/monthly/", filename);
  console.log(imagePath);
  res.download(imagePath);
};
