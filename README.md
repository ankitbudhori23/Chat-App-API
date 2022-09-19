# Chat-App-API

## API Reference

<h2 align="center">
User Route
</h2>

#### For Authentication

```https
  GET /auth/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required** |

#### Get all users

```https
  GET /user/
```

#### Update user profile

```https
  PUT /user/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |

#### Delete user profile

```https
  DELETE /user/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |

#### Find a user

```https
  GET /user/finduser
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| usernmae | `string` | **Required** |
| userId | `string` | **Required** |

#### Follow a user

```https
  PUT /user/:id/follow
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |

#### Unfollow a user

```https
  PUT /user/:id/unfollow
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |

<h2 align="center">
Post Route
</h2>

#### Get all post

```https
  GET /post/
```
#### Get user post

```https
  GET /post/:username
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| username | `string` | **Required** |

#### Edit a post

```https
  PUT /post/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |
| postId | `string` | **Required** |

#### Delete a post

```https
  DELETE /post/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |
| postId | `string` | **Required** |

#### Like a post

```https
  PUT /post/:id/like
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |
| postId | `string` | **Required** |

#### Comment a post

```https
  PUT /post/:id/comment
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| userId | `string` | **Required** |
| postId | `string` | **Required** |
| username | `string` | **Required** |
| comment | `string` | **Required** |


