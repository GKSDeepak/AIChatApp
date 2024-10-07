exports.uploadFile = (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.json({ success: true, file: req.file });
  };
  