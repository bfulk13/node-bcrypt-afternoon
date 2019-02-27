module.exports = {
    register: async (req, res) => {
        try {
            const { username, password, isAdmin } = req.body;
            const db = req.app.get('db')

            let userResponse = await db.get_user(username);
            let user = userResponse[0]

            if (user){
                return res.status(409).send('Username taken')
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt)

            const result = await db.register_user({ isAdmin, username, hash })
            const existingUser = result[0];
            req.session.user = {
                [isAdmin]: user.is_admin,
                [id]: user.id,
                [username]: user.username
            }
            res.status(201).send(req.session.user);
        } catch (error){
            console.log('error signing up user', error)
            res.status(500).send(error)
        }    
        
    }
}