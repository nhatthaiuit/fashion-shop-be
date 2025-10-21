export const getProducts = asyncHandler(async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const total = await Product.countDocuments();
  const items = await Product.find().skip(skip).limit(limit);

  res.setHeader('X-Total-Count', total); // <-- thêm dòng này
  res.json({
    meta: { page, limit, total, totalPages: Math.ceil(total/limit) },
    items
  });
});
