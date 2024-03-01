import { Model } from 'sequelize'
import moment from 'moment'

const loadModel = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Restaurant.belongsTo(models.RestaurantCategory, { foreignKey: 'restaurantCategoryId', as: 'restaurantCategory' })
      Restaurant.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Restaurant.hasMany(models.Product, { foreignKey: 'restaurantId', as: 'products' })
      Restaurant.hasMany(models.Order, { foreignKey: 'restaurantId', as: 'orders' })
    }

    async getAverageServiceTime () {
      try {
        const orders = await this.getOrders()
        const serviceTimes = orders.filter(o => o.deliveredAt).map(o => moment(o.deliveredAt).diff(moment(o.createdAt), 'minutes'))
        return serviceTimes.reduce((acc, serviceTime) => acc + serviceTime, 0) / serviceTimes.length
      } catch (err) {
        return err
      }
    }
  }
  Restaurant.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    postalCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING
    },
    restaurantCategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'RestaurantCategories'
        },
        key: 'id'
      }
    },
    shippingCosts: {
      type: DataTypes.DOUBLE
    },
    email: {
      type: DataTypes.STRING
    },
    logo: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Users'
        },
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['online', 'offline', 'closed', 'temporarily closed']
    },
    heroImage: {
      allowNull: true,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Restaurant'
  })
  return Restaurant
}
export default loadModel
