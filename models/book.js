'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate:{
        notEmpty: {
          msg: 'Title can not be empty'
        }
      }
    },
    author:{
      type: DataTypes.STRING,
      validate : {
        notEmpty: {
          msg: 'Author can not be empty!'
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  return Book;
};