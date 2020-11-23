<h1>Store App</h1>


* [About](#About)
* [Install&run](#Install&run)
* [API](#API)
	- [Signup](#Signup)
  - [Signin](#Signin)
  - [Create product](#Create-product)
  - [Get product/s](#Get-product/s)
    - [Limit the number of products](#Limit-the-number-of-products)
    - [Pagination](#Pagination)
    - [Sort by field](#Sort-by-field)
      - [By date](#By-date)
      - [By price](#By-price)
    - [Sorting by multiple fields](#Sorting-by-multiple-fields)
  - [Add image for product](#Add-image-for-product)
  - [Get image](#Get-image)
  - [Change product](#Change-product)
  - [Delete product](#Delete-product)

## About

  Store application with jwt authentication, MongoDB as database.

## Install&run

  ```shell
  git clone https://github.com/loveyousomuch554/store.git;
  cd store;
  npm install;
  npm run server build;
  ```
  After that you need to set your fields in src/config/.env <br>
  And run `npm run server`
  

# API
## Signup

  ```Shell
  curl --location --request POST 'http://localhost/user/signup' \
--data-raw '{
    "username": "some_user_name",
    "password": "123"
}'
  ```

#### Response
 ```JSON
 {
    "products": [],
    "_id": "5fbb22be6d1ed70586b606c6",
    "username": "some_user_name",
    "password": "$2b$10$Nka/c6/334wWv1GuA7Y7buZF1G0oYqNDP2FP/JYRx3Ak0aijYT156",
    "createdAt": "2020-11-23T02:47:26.292Z",
    "updatedAt": "2020-11-23T02:47:26.292Z",
    "__v": 0
}
 ```

## Signin

  ```Shell
curl --location --request POST 'http://localhost/user/signin' \
--data-raw '{
    "username": "some_user_name",
    "password": "123"
}'
  ```

#### Response
 ```JSON
{
    "token": "some_jwt_token_here",
    "user": {
        "products": [],
        "_id": "5fbb22be6d1ed70586b606c6",
        "username": "some_user_name",
        "createdAt": "2020-11-23T02:47:26.292Z",
        "updatedAt": "2020-11-23T02:47:26.292Z",
        "__v": 0
    }
}
 ```

## Create product

  ```Shell
curl --location --request POST 'http://localhost/product/new-product?secret_token=token' \
--data-raw '{
    "product": {
        "description": "This is first product for this user",
        "price": 1000,
        "name": "First product",
        "author": "5fbb22be6d1ed70586b606c6"
    }
}'
  ```

#### Response
 ```JSON
{
    "_id": "5fbb25fa88cdab086d0ed975",
    "description": "This is first product for this user",
    "price": 1000,
    "name": "First product",
    "author": "5fbb22be6d1ed70586b606c6",
    "createdAt": "2020-11-23T03:01:14.861Z",
    "updatedAt": "2020-11-23T03:01:14.861Z",
    "vendor_code": "00001",
    "__v": 0
}
 ```

## Get product/s

### Limit the number of products
You can limit number of products with param `count`

  ```Shell
curl --location --request GET 'http://localhost/product/find?count=1&secret_token=token'
  ```

#### Response
 ```JSON
[
    {
        "_id": "5fbb25fa88cdab086d0ed975",
        "description": "This is first product for this user",
        "price": 1000,
        "name": "First product",
        "author": {
            "products": [
                "5fbb25fa88cdab086d0ed975"
            ],
            "_id": "5fbb22be6d1ed70586b606c6",
            "username": "some_user_name",
            "password": "$2b$10$Nka/c6/334wWv1GuA7Y7buZF1G0oYqNDP2FP/JYRx3Ak0aijYT156",
            "createdAt": "2020-11-23T02:47:26.292Z",
            "updatedAt": "2020-11-23T03:01:14.953Z",
            "__v": 0
        },
        "createdAt": "2020-11-23T03:01:14.861Z",
        "updatedAt": "2020-11-23T03:01:14.861Z",
        "vendor_code": "00001",
        "__v": 0
    }
]
 ```

### Pagination
To apply pagination use params `count` and `page`

  ```Shell
curl --location --request GET 'http://localhost/product/find?count=3&page=2&secret_token=token'
  ```

#### Response
 ```JSON
[
    {first product},
    {second product},
    {third product}
]
 ```
### Sort by field

### By date
To sort by date use param `sort[createdAt]` with arguments `asc` or `desc`

  ```Shell
curl --location -g --request GET 'http://localhost/product/find?sort[createdAt]=asc&secret_token=token'
  ```

### By price
To sort by price use param `sort[price]` with arguments `asc` or `desc`

  ```Shell
curl --location -g --request GET 'http://localhost/product/find?sort[price]=desc&secret_token=token'
 ```

## Sorting by multiple fields
You can combine fields and sort using custom fields such as

  ```Shell
curl --location -g --request GET 'http://localhost/product/find?count=3&page=4&sort[createdAt]=desc&sort[price]=desc&secret_token=token'
 ```

## Add image for product
If you want to add a product photo you need to make a request via JavaScript, example of request <a href="https://github.com/loveyousomuch554/store/blob/main/src/client/test_img_upload.html">here</a>

```JavaScript
const token = "some token..."
let data = new FormData()

data.append('image', input.files[0])
data.append('product', product_id)
data.append('author', author_id)
fetch(`http://localhost/product/image?secret_token=${token}`, {
  method: 'POST',
  "Content-type": "multipart/form-data",
  body: data
})
```

## Get image

```Shell
curl --location --request GET 'http://localhost/product/image/image_id_here?secret_token=token'
```

## Change product
Specify the fields you want to change
```Shell
curl --location --request PUT 'http://localhost/product/product_id_here?secret_token=token' \
--data-raw '{
    "data": {
        "name": "new_name",
        "other_field: "new_value"
    }
}'
```

### Response 
If the changes were successful: status - `200` and json with old product
or status `500` with message `An error occurred while updating the document.`

## Delete product

```Shell
curl --location --request DELETE 'http://localhost/product/product_id_here?secret_token=token'
```

### Response
If the product is successfully deleted, then a response with status `200` and deleted product