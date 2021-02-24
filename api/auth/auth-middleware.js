const jwt = require('jsonwebtoken')

const checkPayload = (req, res, next) => {
	if (!req.body.username || !req.body.password) {
		res.status(400).json('Please include username and password')
	} else {
		next()
	}
}

const restricted = (req, res, next) => {
	const token = req.headers.authorization

	if (!token) {
		res.status(401).json(`no token bro, cmon bro`)
	} else {
		jwt.verify(token, 'splooie', (err, decoded) => {
			if (err) {
				res.status(401).json('invalid token bro, try again bro ' + err.message)
			} else {
				req.decodedToken = decoded
				next()
			}
		})
	}
}

module.exports = {
	checkPayload,
	restricted
}
