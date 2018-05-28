const express = require('express')
const fetch = require('node-fetch')

const config = require('./config')
const connection = require('./connection')

const server = express()

server.use(express.json())

server.get('/', (request, response) => {
	response.send('Hello world')
})

server.get('/spotify-sign-in', (request, response) => {
	response.redirect(`https://accounts.spotify.com/authorize/?client_id=${config.clientId}&response_type=code&redirect_uri=${config.redirectUri}`)
})

server.get('/spotify-redirect', (request, response) => {
	const code = request.query.code
	if (!code) {
		response.sendStatus(400)
		return
	}

	const authorization = `${config.clientId}:${config.clientSecret}`
	fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${Buffer.from(authorization).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `grant_type=authorization_code&code=${code}&redirect_uri=${config.redirectUri}`
	}).then((response) => {
		return response.json()
	}).then((data) => {
		response.send(JSON.stringify(data))
	}).catch(() => {
		response.sendStatus(500)
	})
})

server.get('/sessions', (request, response) => {
	connection.query('select id, name, code from sessions', (error, results) => {
		if (error) {
			response.sendStatus(500)
			return
		}

		response.send(JSON.stringify(results))
	})
})

server.post('/create-session', (request, response) => {
	if (!(request.body && request.body.name && request.body.code && typeof request.body.code === 'string' && request.body.code.length === 5)) {
		response.sendStatus(400)
		return
	}

	connection.query('insert into sessions (name, code) values(?, ?)', [request.body.name, request.body.code], (error, results) => {
		if (error) {
			response.sendStatus(500)
			return
		}

		response.sendStatus(200)
	})
})

server.listen(7777, () => {
	console.log('Server is listening on port 7777')
})
