import 'dotenv/config';
import express, { response } from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
}   

app.use(loggingMiddleware);

const mockUsers = [
            { id: 1, name: 'ernie', occupation: 'developer', salary: 1000 },
            { id: 2, name: 'diana', occupation: 'programmer', salary: 3000 },
            { id: 3, name: 'ellie', occupation: 'manager', salary: 5000 },
        ]

app.get(
    '/', 
    (req, res, next) => {
        console.log('Base URL');
        next();
    }, 
    (req, res) => {
    res.status(201).send({msg: "Hello"});
});

app.get('/api/users',(req, res) => {
    console.log(req.query);
    const { query: {filter, value} } = req;
    
    if(filter && value) return res.send(mockUsers.filter((user) => user[filter].includes(value)));

    return res.send(mockUsers);
});

app.get('/api/users/:id', (req, res) => {
    console.log(req.params)
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);

    const findUser = mockUsers.find(user => user.id === parsedId);
    
    if(isNaN(parsedId)) return res.status(400).send({ message: "Invalid Input. Must be a number" });
    if(!findUser) return res.sendStatus(404);
    return res.send(findUser)    
});

app.post('/api/users', (req, res) => {
    console.log(req.body);
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
});

app.get('/api/users/:id', (req, res) => {
    // console.log(parseInt(req.params.id));
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);

    const findUser = mockUsers.find(user => user.id === parsedId);

    if(isNaN(parsedId)) return res.status(400).send({ message: "Bad request. Invalid ID." });
    if(!findUser) return res.sendStatus(404);

    res.send(findUser);
});

app.put('/api/users/:id', (req, res) => {
    const { 
        body, 
        params: { id } 
    } = req;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

    if(findUserIndex === -1) return res.sendStatus(404);

    mockUsers[findUserIndex] = { id: parsedId, ...body };
    return res.sendStatus(200);
});

app.patch('/api/users/:id', (req, res) => {
    const { 
        body, 
        params: { id } 
    } = req;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return res.sendStatus(404);

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

    return res.sendStatus(200);

});

app.delete('/api/users/:id', (req, res) => {
    const { 
        params: { id } 
    } = req;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return response.sendStatus(404);
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});