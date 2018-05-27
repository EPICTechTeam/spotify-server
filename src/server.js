const express = require('express')

const connection = require('./connection')

const server = express()

server.use(express.json())

server.get('/', (request, response) => {
	response.send('Hello world')
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
