const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const port = 3000
const salt = bcrypt.genSaltSync(10)
const secret = 'kjgfn34mb3roi34mrb3fkl3ntu3b4r34rb'
const uploadMiddleware = multer({ dest: 'uploads/' })
const app = express()

const userModel = require('./models/User.js')
const postModel = require('./models/Post.js')

mongoose.connect('mongodb+srv://ranjansinhaharikesh:jDrGQyDIkfq359b6@cluster0.cllow9d.mongodb.net/')

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.post('/register-user', async (req, res) => {
    const { firstName, lastName, email, number, password } = req.body

    try {
        const userDoc = await userModel.create({
            firstName,
            lastName,
            email,
            number,
            password: bcrypt.hashSync(password, salt),
        })
        res.json(userDoc)
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: 'User already exists' })
        }
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await userModel.findOne({ email: username });

    if (!userDoc) {
        return res.status(400).json({ error: 'User not found' });
    }

    const passOK = bcrypt.compareSync(password, userDoc.password);

    if (passOK) {
        const tokenPayload = {
            username,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            number: userDoc.number,
            id: userDoc._id
        }

        jwt.sign(tokenPayload, secret, {}, (err, token) => {
            if (err) {
                console.error('Error signing token:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.cookie('token', token, { httpOnly: true, secure: true }).json({
                id: userDoc._id,
                username,
                firstName: userDoc.firstName,
                lastName: userDoc.lastName,
                number: userDoc.number
            });
        });
    } else {
        res.status(400).json({ error: 'Incorrect Credentials' });
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(info);
    });
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);

        const { token } = req.cookies
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err

            const { title, summary, content } = req.body;
            const postDoc = await postModel.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id
            });
            res.json(postDoc);
        })

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/post', async (req, res) => {
    res.json(
        await postModel
            .find()
            .populate('author', ['firstName'])
            .sort({ createdAt: -1 })
            .limit(35)
    )
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;

    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        const { id, title, summary, content } = req.body;

        const postDoc = await postModel.findById(id);

        if (!postDoc) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if (!isAuthor) {
            return res.status(403).json({ error: 'You are not the author' });
        }

        // Update the document using the model
        await postModel.updateOne(
            { _id: id },
            {
                $set: {
                    title,
                    summary,
                    content,
                    cover: newPath ? newPath : postDoc.cover,
                },
            }
        );

        // Fetch the updated document
        const updatedPostDoc = await postModel.findById(id);
        
        res.json(updatedPostDoc);
    });
});


app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    const postDoc = await postModel.findById(id).populate('author', ['firstName'])

    res.json(postDoc)
})

app.listen(port, () => {
    console.log(`Your server is running at port: ${port}`)
})

// jDrGQyDIkfq359b6