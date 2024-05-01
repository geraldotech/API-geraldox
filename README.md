# APIgeraldoX

- [x] Fastify
- [x] Typescript
- [x] Zod
- [x] sqlite
- [x] VueJS 3 client side


### `Installation`

`npm install`

## `RUN`

`npm run server`

## `Routes`


```js

- POST /post/ // create

- status in client side:
  - 201 ok
  - 409 conflit
  - 400 bad request - zod validation
  - 500 server error

- PUT /post/:slug // edit blog post

- DELETE /post/:slug // delete single

- GET /posts // fetch all published posts
- GET /post/:slug // fetch single

- GET /posts/categories // fetch all categories
- GET /posts/category?name=android // fetch single
- GET /posts/search?q=  // search least three characters long

```

## The body JSON requests examples:

### `POST`

-  zod schema

```js

title: z.string().min(10).max(100),
article: z.string().default(''),
category: z.string().default('uncategorized'), //if body no sdefault, but if send must be string
author: z.string(),
vuecomponent: z.string().nullaboptional(), // optional se enviar muststring or null, default is null
published: z.boolean().default(true),

```
- POST Expected body JSON

```json
{
  "title": "My smart blog post",
  "article": "popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  "category": "android",
  "author": "geraldo",
  "vuecomponent": "<BestComponent/>",
  "published": true
}

// minimum
{
"title": "Midnight Show", //min 10 max 100 characters
"author": "geraldo", //max 20 characters
}

// defaults if undefined

category: uncategorized
article: ""
published: true
vuecomponent: null
createdAt: Auto-generated Timestamps

```

### - `PUT` 

> change title will change slug!
> maximum expected body JSON

```json
{
  "title": "Isabella gosta muito de bolo",
  "article": "VueJS3 with Typescript 4",
  "category": "games",
  "author": "Isabella",
  "published": true,
  "vuecomponent": "<BestComponent/>",
}
```


### pages

- /dashboard
  - /newpost
  - /edit/:slug




- zod in httppie

  - if try send vuecomponent a number instead string: `"Expected string, received number\`

- sem zod

  - se no /post o body não enviar os tipos de dado correto ele retorna que criou o post, realmente criou com os dados incorretos no banco de dados

- com zod é retornado um erro em caso de tipo de dados incorreto



- no add typemodule in package.json it can cause problems can try import a file.ts you will need `import file from file.js` instead `import file from file`

- `pigeraldox\node_modules\fastify\lib\route.js:416
              throw new FST_ERR_SCH_VALIDATION_BUILD(opts.method, url, error.message)
                    ^
FastifyError [Error]: Failed building the validation schema for GET: /post/:slug, due to error schema is invalid: data/required must be array` try it https://github.com/turkerdev/fastify-type-provider-zod


# Next features:

- updatedAt?
- images?


# installed

- npm install @fastify/static@next
- npm i @fastify/cors