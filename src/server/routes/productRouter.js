require('../auth/product')
const productRouter = require('express').Router()
const { productController: { Query, Product, Image, authorization } } = require('../controllers/productController')
const multer = require('multer')

productRouter.post('/new-product', (req, res) => {
  const { product } = req.body
  new Product(product).save(res)
})

let storage = multer.memoryStorage()
let upload = multer({ storage: storage })

productRouter.post('/image', upload.single('image'), validateFields, async (req, res) => {
  const name = req.file.originalname
  const img = {
    data: req.file.buffer,
    contentType: req.file.mimetype
  }
  const { product, author } = req.body
  const image = { name, img, product, author }

  new Image(image).save(res)
})

productRouter.get('/find', async (req, res) => {
  const { count, page, sort } = req.query
  new Query({ count, page, sort }, res).findAndSend()
})

productRouter.get('/image/:id', (req, res) => {
  const { id } = req.params
  Image.getImage(id, res)
})

productRouter.put('/:id', authorization, (req, res) => {
  const { data } = req.body
  const { id } = req.params
  Product.change(data, id, res)
})

productRouter.delete('/:id', authorization, (req, res) => {
  const { id } = req.params
  Product.delete(id, res)
})

function validateFields(req, res, next) {
  if (!req.file) {
    res.status(400).send('BAD REQUEST')
    return;
  }
  next()
}

exports.productRouter = productRouter