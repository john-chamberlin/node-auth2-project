const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { checkPayload } = require('./auth-middleware')
const Users = require('../users/user-model')

router.post('/register', checkPayload, (req, res) => {
	const credentials = req.body
	const hash = bcrypt.hashSync(req.body.password, 8)
	credentials.password = hash
	Users.add(credentials)
		.then(user => {
			res.status(201).json(user)
		})
		.catch(err => {
			res.status(500).json(`Server error: ${err.message}`)
		})
})

router.post('/login', checkPayload, (req, res) => {
	Users.findBy({ username: req.body.username })
		.then(([user]) => {
			const verified = bcrypt.compareSync(req.body.password, user.password)
			if (verified) {
				const token = makeToken(user)
				res.status(200).json({
					message: 'Welcome to the API',
					token
				})
			} else {
				res.status(401).json({ message: 'Invalid credentials' })
			}
		})
		.catch(err => {
			res.status(500).json(`Server error: poo${err.message}`)
		})
})

function makeToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		department: user.department
	}
	const options = {
		expiresIn: '20m'
	}
	return jwt.sign(payload, 'splooie', options)
}

module.exports = router
