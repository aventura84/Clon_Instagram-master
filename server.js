require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/users');

const {
  getPostsController,
  newPostController,
  getSinglePostController,
  deletePostController,
} = require('./controllers/Posts');
const cors = require('cors');

const { authUser } = require('./middlewares/auth');
// const likePost = require('./controllers/likeEntry');

var app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));

//Rutas de usuario
app.get('/user/:id', getUserController);
app.post('/user/login', loginController);
app.post('/user/register', newUserController);

//Rutas de posts
app.get('/posts', getPostsController);
app.post('/post/create', authUser, newPostController);
app.get('/post/:id', getSinglePostController);
app.delete('/post/delete/:id', authUser, deletePostController);

//Rutas de likes
//app.get('likes'getLikesController);
//app.post('likes/create,authUser,newLikeController);
//app.get('likes/:id', getSingleLikeContoller);
//app.delete('/likes/delete:id',authUser,deletePostController);

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

// Lanzamos el servidor
app.listen(8080, () => {
  console.log('Servidor funcionando en el puerto 8080 👻');
});
