module.exports = {
    'facebookAuth': {
        'clientID': process.env.FACEBOOK_AUTH_CLIENT_ID, // your App ID
        'clientSecret': process.env.FACEBOOK_CLIENT_SECRET, // your App Secret
        'callbackURL': 'https://templefeedback.onrender.com/auth/facebook/callback'
    },
    'mysql': {
        'host': process.env.MYSQL_HOST,
        'user':  process.env.MYSQL_USER,
        'password': process.env.MYSQL_PASSWORD,
        'database': process.env.MYSQL_DATABASE,
        'port': '3306'
    },
    'pokemonAPI': {
        'apiKey': process.env.POKEMON_API
    },
    'use_database': true,
}
