// Script insert admin NOKOSKU
const bcrypt = require('bcrypt');
const User = require('./backend/models/user');
const sequelize = require('./backend/models/db');

async function insertAdmin() {
  await sequelize.sync();
  const hash = await bcrypt.hash('088103', 10);
  await User.upsert({
    email: 'ibradecode@gmail.com',
    password: hash,
    name: 'Admin',
    is_admin: true
  });
  console.log('Admin inserted');
}

insertAdmin().then(() => process.exit());