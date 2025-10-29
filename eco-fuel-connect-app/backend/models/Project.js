const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Project extends Model {}

Project.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'planning',
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium',
  },
  budget: {
    type: DataTypes.JSON,
    defaultValue: { allocated: 0, spent: 0 }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  timeline: {
    type: DataTypes.JSON,
    defaultValue: { startDate: null, endDate: null, milestones: [] }
  },
  location: {
    type: DataTypes.JSON,
    defaultValue: { region: '', state: '', county: '', coordinates: { latitude: null, longitude: null } }
  },
  stakeholders: {
    type: DataTypes.JSON,
    defaultValue: { projectManager: null, teamMembers: [], beneficiaries: { schools: [], communities: [], estimatedBeneficiaries: 0 } }
  },
  objectives: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  milestones: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  resources: {
    type: DataTypes.JSON,
    defaultValue: { equipment: [], materials: [], budget: 0 }
  },
  impact: {
    type: DataTypes.JSON,
    defaultValue: { beneficiaries: 0, environment: '', community: '' }
  },
  documents: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  updates: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lastModifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'projects',
  timestamps: true
});

module.exports = Project;