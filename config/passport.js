import passport from 'passport';
import LocalStrategy from 'passport-local';
import pool from '../repositories/pool.js';
import bcrypt from 'bcrypt';
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = rows[0];
            if (!user) return done(null, false);
            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});