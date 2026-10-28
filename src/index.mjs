import 'dotenv/config';
import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();
const mockUsers = [
            { id: 1, name: 'ernie', occupation: 'developer', salary: 1000 },
            { id: 2, name: 'diana', occupation: 'programmer', salary: 3000 },
            { id: 3, name: 'ellie', occupation: 'manager', salary: 5000 },
        ]

app.get('/api/users', (req, res) => {
    console.log(req.query);
    const { query: {filter, value} } = req;
    
    if(filter && value) return res.send(mockUsers.filter((user) => user[filter].includes(value)));

    return res.send(mockUsers);
});

// app.get('/api/users/:id', (req, res) => {
//     console.log(req.params)
//     const parsedId = parseInt(req.params.id);
//     console.log(parsedId);

//     const findUser = mockUsers.find(user => user.id === parsedId);
    
//     if(isNaN(parsedId)) return res.status(400).send({ message: "Invalid Input. Must be a number" });
//     if(!findUser) return res.sendStatus(404);
//     return res.send(findUser)    
// });

app.get('/api/users/:id', (req, res) => {
    // console.log(parseInt(req.params.id));
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);

    const findUser = mockUsers.find(user => user.id === parsedId);

    if(isNaN(parsedId)) return res.status(400).send({ message: "Bad request. Invalid ID." });
    if(!findUser) return res.sendStatus(404);

    res.send(findUser);
});

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});