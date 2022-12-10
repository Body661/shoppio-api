
# Nodejs E-commerce Api




## API Reference

#### Create category

```http
  POST /api/categories
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. The category name |


#### Get All categories

```http
  GET /api/categories
```

#### Get a specific category

```http
  GET /api/categories/:id
```

| Params | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. The category id |


#### Update a category

```http
  PUT /api/categories/:id
```

| Params | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. The category id |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. The new category name |

#### Delete a category

```http
  DELETE /api/categories/:id
```

| Params | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. The category id |
