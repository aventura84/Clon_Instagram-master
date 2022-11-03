/* eslint-disable no-undef */
const { createPost, getAllPosts } = require('../db/posts');
const { generateError, createPathIfNotExists } = require('../helpers');
const path = require('path');
const sharp = require('sharp');
//const { nanoid } = require('nanoid');

const getPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const newPostController = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!req.files.image && !req.text.length > 280) {
      throw generateError(
        'Debes postear una foto con un texto menor de 280',
        400
      );
    }
    let imageFileName;

    if (req.files && req.files.image) {
      //Creo el path del directorio uploads
      const uploadsDir = path.join(__dirname, '../uploads');

      //Creo el directorio si no existe
      await createPathIfNotExists(uploadsDir);

      //Procesar la imagen
      const image = sharp(req.files.image.data);
      image.resize({ heigth: 100 });
      //Guardo la imagen con un nombre aleatorio en el directorio uploads
    }
    imageFileName = '${nanoid(24)}.jpg';

    await image.toFile(path.join(uploadsDir, imageFileName));

    const uploadsDir = path.join(__dirname, '../uploads');

    // Creo el directorio si no existe
    await createPathIfNotExists(uploadsDir);

    const id = await createPost(req.userId, text && imageFileName);
    res.send({
      status: 'ok',
      message: `Post con id:${id}creado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

const getSinglePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostByText(id);

    res.send({
      status: 'ok',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  try {
    //req.userId
    const { id } = req.params;

    // Conseguir la información del post que quiero borrar
    const post = await getPostById(id);

    // Comprobar que el usuario del token es el mismo que creó el post
    if (req.userId !== post.user_id) {
      throw generateError(
        'Estás intentando borrar un post que no es tuyo',
        401
      );
    }

    // Borrar el post
    await detelePostById(id);

    res.send({
      status: 'ok',
      message: `El post con id: ${id} fue borrado`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostsController,
  newPostController,
  getSinglePostController,
  deletePostController,
};
