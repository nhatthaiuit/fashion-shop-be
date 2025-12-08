// controllers/product.controller.js
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 20, 1);
  const skip = (page - 1) * limit;

  // ---- Build filter
  const filter = {};

  // Lọc theo category (Top/Bottom/Accessories/...)
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Tìm kiếm toàn văn (đã có text index name/category)
  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }

  // Chỉ lấy hàng còn bán (tuỳ chọn): inStock=1|true
  // Nguyên tắc: countInStock > 0 (với Top/Bottom: đã = tổng sizes.stock nhờ model)
  if (String(req.query.inStock).toLowerCase() === '1' ||
    String(req.query.inStock).toLowerCase() === 'true') {
    filter.countInStock = { $gt: 0 };
    filter.status = { $ne: 'discontinued' };
  }

  // ---- Sort
  const sortParam = (req.query.sort || '').toLowerCase();
  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };
  const sort = sortMap[sortParam] || { createdAt: -1 };

  // ---- Query
  const total = await Product.countDocuments(filter);
  const items = await Product.find(filter).sort(sort).skip(skip).limit(limit);

  // ---- Headers for FE
  res.set('Access-Control-Expose-Headers', 'X-Total-Count');
  res.set('X-Total-Count', String(total));

  res.json({
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    },
    items
  });
});


export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const body = req.body;

  // ⚙️ Nếu có sizes -> bỏ qua countInStock, để schema tự tính
  if (Array.isArray(body.sizes) && body.sizes.length) {
    delete body.countInStock;
  }

  Object.assign(product, body);
  await product.save(); // pre('validate') & pre('save') sẽ tự xử lý

  res.json(product);
});