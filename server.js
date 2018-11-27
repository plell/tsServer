const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 8000;
const secret = process.env.JWT_SECRET || 'fa783g4fiafisebuskdk'

server.listen(port);
console.log('listening on port', port);

// websockets

io.on('connection', (client) => {
    client.on('pushGameboard', (slots) => {
        io.emit('updateGameboard', slots);
        console.log('update')
      })
})

// api

app.get('/api', verifyToken, (req, res)=>{
    res.json({message: 'welcome to the api!!'})
})

app.post('/api/post', verifyToken, (req, res) => {
    const userid = req.userid
    if (userid) res.json({message:'posted!!', userid})
})

app.post('/api/login', async (req, res) => {
    //mock user
    const user = {
        id: 1,
        firstName: 'david',
        lastName: 'plell'
    }
    const token = await jwt.sign({user},secret, {expiresIn:'120s'})
    if (token) res.json({token})
})

// functions

function verifyToken(req,res,next){
    // get auth header
    const bearerHeader = req.headers['authorization']
    
    if (typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        jwt.verify(req.token, secret, (err, token) => {
            if (err) res.sendStatus(403)
            else {
                req.userid = token.id 
                next()
            }
        })
    } else {
        res.sendStatus(403)
    }
}


