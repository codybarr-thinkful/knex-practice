require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
	client: 'pg',
	connection: process.env.DB_URL
})

function searchByShoppingListItemName(searchTerm) {
	knexInstance
		.select('id', 'name', 'price', 'checked', 'category')
		.from('shopping_list')
		.where('name', 'ILIKE', `%${searchTerm}%`)
		.then(result => {
			console.log('SEARCH TERM', { searchTerm })
			console.log(result)
		})
}

searchByShoppingListItemName('acon')

function paginateShoppingListItems(page) {
	const limit = 6
	const offset = limit * (page - 1)
	knexInstance
		.select('id', 'name', 'price', 'checked', 'category')
		.from('shopping_list')
		.limit(limit)
		.offset(offset)
		.then(result => {
			console.log('PAGINATE ITEMS', { page })
			console.log(result)
		})
}

paginateShoppingListItems(2)

/*
3. Get all items added after date
    * A function that takes one parameter for daysAgo which will be a number representing a number of days.
    * This function will query the shopping_list table using Knex methods and select the 
	  rows which have a date_added that is greater than the daysAgo.
*/

function productsAddedDaysAgo(daysAgo) {
	knexInstance
		.select('id', 'name', 'price', 'date_added', 'checked', 'category')
		.from('shopping_list')
		.where(
			'date_added',
			'>',
			knexInstance.raw(`now() - ':daysAgo: days':: INTERVAL`, { daysAgo })
		)
		.then(results => {
			console.log('PRODUCTS ADDED DAYS AGO')
			console.log(results)
		})
}

productsAddedDaysAgo(5)

/*

4. Get the total cost for each category
    * A function that takes no parameters
    * The function will query the shopping_list table using Knex methods 
    * and select the rows grouped by their category and showing the total price for each category.


SELECT DISTINCT category, sum(price) AS total
FROM shopping_list
GROUP BY category
ORDER BY total DESC
*/
function costPerCategory() {
	knexInstance
		.distinct('category')
		.sum({ total: 'price' })
		.from('shopping_list')
		.groupBy('category')
		.orderBy('total', 'DESC')
		.then(result => {
			console.log('COST PER CATEGORY')
			console.log(result)
		})
}

costPerCategory()
