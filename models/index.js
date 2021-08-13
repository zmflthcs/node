'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;



db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize,Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User) // user and post is 1:N relation

db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'}); //PostHashtag table is made. it contains post and hashtag's id inside

db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow'
})

db.User.belongsToMany(db.User,{
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

module.exports = db;