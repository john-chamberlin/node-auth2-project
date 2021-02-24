const express = require('express')
const router = express.Router()

const { restricted } = require('../auth/auth-middleware')
const Users = require('./user-model')

router.get('/', restricted, (req, res) => {
	Users.find()
		.then(users => {
			res.status(200).json(users)
		})
		.catch(err => {
			res.status(500).json(`Server error: ${err}`)
		})
})

module.exports = router
