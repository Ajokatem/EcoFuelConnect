const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'First name is required' },
      len: { args: [1, 50], msg: 'First name cannot exceed 50 characters' }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name is required' },
      len: { args: [1, 50], msg: 'Last name cannot exceed 50 characters' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please enter a valid email' },
      notEmpty: { msg: 'Email is required' }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Password must be at least 6 characters long' }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: { args: /^[\+]?[1-9][\d]{0,15}$/, msg: 'Please enter a valid phone number' }
    }
  },
  organization: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'supplier', 'producer', 'consumer', 'school'),
    allowNull: false
  },
  // supplierType: {
  //   type: DataTypes.ENUM('market', 'slaughterhouse', 'restaurant', 'household', 'farm'),
  //   allowNull: true
  // },
  // supplierId: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   unique: true
  // },
  // plantCapacity: {
  //   type: DataTypes.DECIMAL(10, 2),
  //   allowNull: true
  // },
  // producerId: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   unique: true
  // },
  // certifications: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   defaultValue: []
  // },
  // studentCount: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
  // schoolType: {
  //   type: DataTypes.ENUM('primary', 'secondary', 'university', 'technical'),
  //   allowNull: true
  // },
  // schoolId: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   unique: true
  // },
  // address: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   defaultValue: {
  //     street: '',
  //     city: '',
  //     state: '',
  //     zipCode: '',
  //     country: 'South Sudan'
  //   }
  // },
  // profile: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   defaultValue: {
  //     avatar: '',
  //     bio: '',
  //     interests: [],
  //     preferredFuelTypes: []
  //   }
  // },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  profileImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  // lastLogin: {
  //   type: DataTypes.DATE,
  //   allowNull: true
  // },
  // lastLogoutAt: {
  //   type: DataTypes.DATE,
  //   allowNull: true
  // },
  // statistics: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   defaultValue: {
  //     totalSessions: 0,
  //     totalLoginAttempts: 0
  //   }
  // },
  // preferences: {
  //   type: DataTypes.JSON,
  //   allowNull: true,
  //   defaultValue: {
  //     notifications: {
  //       email: true,
  //       sms: false,
  //       push: true
  //     },
  //     language: 'en',
  //     theme: 'light'
  //   }
  // }
}, {
  timestamps: true,
  tableName: 'users'
});

// Hash password before creating/updating
User.addHook('beforeCreate', async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.addHook('beforeUpdate', async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return await this.save();
};

User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.getProfileCompletion = function() {
  let completion = 0;
  const totalFields = 10;
  
  if (this.firstName) completion++;
  if (this.lastName) completion++;
  if (this.email) completion++;
  if (this.phone) completion++;
  if (this.organization) completion++;
  if (this.address && Object.keys(this.address).length > 0) completion++;
  if (this.role) completion++;
  if (this.emailVerified) completion++;
  
  // Role-specific fields
  if (this.role === 'supplier' && this.supplierId) completion++;
  if (this.role === 'producer' && this.plantCapacity) completion++;
  if (this.role === 'school' && this.studentCount) completion++;
  
  return Math.round((completion / totalFields) * 100);
};

// Hide password in JSON output
User.prototype.toJSON = function() {
  const values = { ...this.dataValues };
  delete values.password;
  return values;
};

module.exports = User;