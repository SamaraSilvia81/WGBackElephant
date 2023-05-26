import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';

const Character = sequelize.define('Character', {
  charname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alterego: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isHero: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Definindo o valor padrão como false
  },
  isMarvel: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Definindo o valor padrão como false
  }
});

export default Character;