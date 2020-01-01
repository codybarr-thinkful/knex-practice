const knex = require('knex')
const ShoppingListService = require('../src/shopping-list-service')

describe.only(`Shopping List service object`, function() {
	let db
	let testShoppingListItems = [
		{
			id: 1,
			name: 'Fish tricks',
			price: '13.10',
			date_added: new Date('2020-01-22T16:28:32.615Z'),
			checked: true,
			category: 'Main'
		},
		{
			id: 2,
			name: 'Not Dogs',
			price: '4.99',
			date_added: new Date('2019-07-13T16:28:32.615Z'),
			checked: false,
			category: 'Snack'
		},
		{
			id: 3,
			name: 'Buffalo Wings',
			price: '5.50',
			date_added: new Date('2021-03-26T16:28:32.615Z'),
			checked: true,
			category: 'Lunch'
		}
	]

	before(() => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL
		})
	})

	after(() => db.destroy())

	context(`Given 'shopping_list' has data`, () => {
		beforeEach(() => {
			return db('shopping_list').truncate()
		})

		beforeEach(() => {
			return db.into('shopping_list').insert(testShoppingListItems)
		})

		it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
			return ShoppingListService.getAllItems(db).then(actual => {
				expect(actual).to.eql(testShoppingListItems)
			})
		})

		it(`getById() resolves an item by id from 'shopping_list' table`, () => {
			const thirdId = 3
			const thirdTestItem = testShoppingListItems[thirdId - 1]
			return ShoppingListService.getById(db, thirdId).then(actual => {
				expect(actual).to.eql({
					id: thirdId,
					...thirdTestItem
				})
			})
		})

		it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
			const itemId = 3
			return ShoppingListService.deleteItem(db, itemId)
				.then(() => ShoppingListService.getAllItems(db))
				.then(allItems => {
					// copy the test items array without the "deleted" item
					const expected = testShoppingListItems.filter(
						item => item.id !== itemId
					)
					expect(allItems).to.eql(expected)
				})
		})

		it(`updateItem() updates an item from the 'shopping_list' table`, () => {
			const idOfItemToUpdate = 3
			const newItemData = {
				name: 'new item name',
				price: '22.10',
				date_added: new Date(),
				checked: true,
				category: 'Main'
			}

			return ShoppingListService.updateItem(
				db,
				idOfItemToUpdate,
				newItemData
			)
				.then(() => ShoppingListService.getById(db, idOfItemToUpdate))
				.then(item => {
					expect(item).to.eql({
						id: idOfItemToUpdate,
						...newItemData
					})
				})
		})
	})

	context(`Given 'shopping_list' has no data`, () => {
		beforeEach(() => {
			return db('shopping_list').truncate()
		})

		it(`getAllItems() resolves an empty array`, () => {
			return ShoppingListService.getAllItems(db).then(actual => {
				expect(actual).to.eql([])
			})
		})

		it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
			const newItem = {
				name: 'really new item name',
				price: '100.00',
				date_added: new Date(),
				checked: false,
				category: 'Snack'
			}

			return ShoppingListService.insertItem(db, newItem).then(actual => {
				expect(actual).to.eql({
					id: 1,
					...newItem
				})
			})
		})
	})
})
