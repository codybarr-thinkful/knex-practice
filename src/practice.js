require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
	client: 'pg',
	connection: process.env.DB_URL
})

/*
You need to build a query that allows customers to search the 
amazong_products table for products that contain a word... I'll 
tell you the word later. Hurry hurry!

SELECT product_id, name, price, category
  FROM amazong_products
WHERE name ILIKE '%holo%'; (case insensitive)
*/

function searchByProduceName(searchTerm) {
	knexInstance
		.select('product_id', 'name', 'price', 'category')
		.from('amazong_products')
		.where('name', 'ILIKE', `%${searchTerm}%`)
		.then(result => {
			console.log(result)
		})
}

searchByProduceName('holo')

/*
You need to build a query that allows customers to paginate the 
amazong_products table products, 10 products at a time.

SELECT product_id, name, price, category
  FROM amazong_products
LIMIT 10
  OFFSET 0;
*/

function paginateProducts(page) {
	const productsPerPage = 10
	const offset = productsPerPage * (page - 1)
	knexInstance
		.select('product_id', 'name', 'price', 'category')
		.from('amazong_products')
		.limit(productsPerPage)
		.offset(offset)
		.then(result => {
			console.log(result)
		})
}

paginateProducts(2)

/*
You need to build a query that allows customers to filter the amazong_products 
table for products that have images.

SELECT product_id, name, price, category, image
  FROM amazong_products
  WHERE image IS NOT NULL;
*/

function getProductsWithImages() {
	knexInstance
		.select('product_id', 'name', 'price', 'category', 'image')
		.from('amazong_products')
		.whereNotNull('image')
		.then(result => {
			console.log(result)
		})
}

getProductsWithImages()

/* 
You need to build a query that allows customers to see the most popular videos 
by view at Whopipe by region for the last 30 days.

SELECT video_name, region, count(date_viewed) AS views
FROM whopipe_video_views
  WHERE date_viewed > (now() - '30 days'::INTERVAL)
GROUP BY video_name, region
ORDER BY region ASC, views DESC;
*/

function mostPopularVideosForDays(days) {
	knexInstance
		.select('video_name', 'region')
		.count('date_viewed AS views')
		.where(
			'date_viewed',
			'>',
			knexInstance.raw(`now() - ':days: days'::INTERVAL`, { days })
		)
		.from('whopipe_video_views')
		.groupBy('video_name', 'region')
		.orderBy([
			{ column: 'region', order: 'ASC' },
			{ column: 'views', order: 'DESC' }
		])
		.then(result => {
			console.log(result)
		})
}

mostPopularVideosForDays(30)
