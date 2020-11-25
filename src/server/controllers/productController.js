const { ProductModel } = require('../models/product')
const { ImageModel } = require('../models/image')
const { UserModel } = require('../models/user')

class Product {
  constructor(product_obj = null) {
    this.product_obj = product_obj
  }

  async save(res) {
    new ProductModel({ ...this.product_obj }).save(async (err, doc) => {
      if (err) {
        res.status(500).send('An error occurred while creating product.')
        return;
      }
      const { author } = doc

      // Add product to user field 'products'
      let update = await updateField(UserModel, author, { $addToSet: { products: [doc._id] } })
      if (update.isError) {
        res.status(500).send('An error occurred while updating the document.')
        return;
      }
      res.json(doc)
    })
  }

  static async change(fields, id, res) {
    let newProduct = await updateField(ProductModel, id, fields)
    if (newProduct.isError) {
      res.status(500).send('An error occurred while updating the document.')
      return;
    }
    res.status(200).json(newProduct.data)
  }

  static delete(id, res) {
    ProductModel.findByIdAndDelete(id)
      .then(async (deletedProd) => {
        try {
          // Remove product id from user account
          const { products } = await UserModel.findById(deletedProd.author)
          const filteredP = products.filter(a => a.toString() !== id)
          await UserModel.findByIdAndUpdate(deletedProd.author, { products: filteredP })

          // Remove photo from product
          if (deletedProd.image) {
            await ImageModel.findByIdAndDelete(deletedProd.image)
          }
        } catch (error) {
          console.log(error)
          res.status(500).send('An error occurred while deleting the document.')
          return
        }
        res.status(200).json(deletedProd)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send('An error occurred while deleting the document.')
      })
  }
}

class Query {
  constructor(query, res) {
    this.query = query
    this.res = res
  }

  async findAndSend() {
    await ProductModel
      .find({})
      .limit(+this.query.count||0)
      .skip(+this.query.count*((this.query.page-1) < 0 ? 0 : this.query.page-1))
      .sort(this.sortFields())
      .populate('author')
      // .populate('image') // too many data
      .then((docs) => {
        this.res.json(docs)
      })
      .catch((err) => {
        console.error(err)
        this.res.status(500).send('An error occurred while find products...')
      })
    return this
  }

  sortFields() {
    let fields = []
    let sort = this.query.sort
    for(let field in sort) {
      fields.push([field, sort[field]])
    }
    return fields
  }
}

class Image {
  constructor(image) {
    this.image = image
  }

  save(res) {
    new ImageModel(this.image).save(async (err, doc) => {
      if (err) {
        res.status(500).send('An error occurred while adding image.')
        return;
      }
      // Update product
      let productUpdate = await updateField(ProductModel, this.image.product, { image: doc })
      if (productUpdate.isError) {
        res.status(500).send('An error occurred while updating the document.')
        return;
      }

      res.json(doc)
    })
  }

  static getImage(id, res) {
    ImageModel.findById(id)
      .then((image) => {
        if (image === null) {
          res.status(404).send('Image not found.')
          return;
        }
        res.header('Content-Type', 'image/png')
        res.send(image.img.data)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('An error occured while find image...')
      })
  }
}

async function updateField(model, id, field) {
  let data;
  try {
    data = await model.findByIdAndUpdate(id, field)
  } catch (error) {
    console.error(error)
    return { error, isError: true }
  }
  return { data, isError: false }
}

async function authorization(req, res, next) {
  UserModel.findById(req.user._id)
    .then(({ products }) => {
      const isUserOwnProduct = products.includes(req.params.id)
      if (!isUserOwnProduct) {
        res.status(401).send('UNAUTHORIZED')
        return;
      }
      next()
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}

exports.productController = { Product, Image, Query, authorization }