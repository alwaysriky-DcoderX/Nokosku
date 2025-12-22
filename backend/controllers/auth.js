// Controller Auth NOKOSKU
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Activity = require('../models/activity');
const SECRET = process.env.JWT_SECRET || 'nokosku-secret';

// Register user
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi!' });
        const exist = await User.findOne({ where: { email } });
        if (exist) return res.status(409).json({ error: 'Akun sudah terdaftar. Coba login.' });
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hash, name });
        await Activity.create({
            user_id: user.id,
            event: 'user:register',
            detail: `User daftar dengan email ${user.email}`
        });
        return res.json({ success: true, message: 'Registrasi sukses, silakan login.', email: user.email });
    } catch (e) {
        console.error('Register error:', e);
        return res.status(500).json({ error: 'Maaf, sistem error. Coba lagi.' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi!' });
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Email belum terdaftar.' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Password salah.' });
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
        await Activity.create({
            user_id: user.id,
            event: 'user:login',
            detail: `User login dengan email ${user.email}`
        });
        return res.json({ success: true, token, name: user.name, email: user.email });
    } catch (e) {
        console.error('Login error:', e);
        return res.status(500).json({ error: 'Maaf, sistem error. Coba lagi.' });
    }
};