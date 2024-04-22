# apiGERALDOX

```js

- GET /posts //fetch all
- GET /post/:slug
- DELETE /post/:slug
- PUT /post/:slug

```

- [x] Zod validation for create a post

- no add typemodule in package.json it can cause problems can try import a file.ts you will need `import file from file.js` instead `import file from file`

- `pigeraldox\node_modules\fastify\lib\route.js:416
              throw new FST_ERR_SCH_VALIDATION_BUILD(opts.method, url, error.message)
                    ^
FastifyError [Error]: Failed building the validation schema for GET: /post/:slug, due to error schema is invalid: data/required must be array` try it https://github.com/turkerdev/fastify-type-provider-zod

- zod in httppie
  if try send vuecomponent a number instead string: `"Expected string, received number\`

- sem zod
- se no /post o body não enviar os tipos de dado correto ele retorna que criou o post, realmente criou com os dados incorretos no banco de dados

- com zod é retornado um erro em caso de tipo de dados incorreto

```js

title: z.string(),
article: z.string(),
category: z.string(),
author: z.string(),
vuecomponent: z.string().nullable(),
published: z.boolean(),

```


- POST /post/

> the body JSON

```json
{
  "title": "Zod validation 3",
  "article": "popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  "category": "android",
  "author": "geraldo",
  "vuecomponent": "<Best/>",
  "published": true
}

// minimum

{
"title": "Xmen data is compatible with the new datatype", //min 10 max 100 characters
"author": "geraldo",
}

// defaults

category: uncategorized
article: ""
published: true
vuecomponent: null

```

- PUT json

```json

{
"title": "Isabella Gosta de Bolo muito",
"article": "VueJS3 with Typescript 4",
"category": "games",
"author": "Isabella",
"published": true
}

```
