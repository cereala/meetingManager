const config = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    URL: process.env.BASE_URL || 'http://localhost:5000',
    MONGODB_URI: 'mongodb+srv://sergiuBodea77:' + encodeURIComponent('mxck2577') + '@myfirstcluster.6bvkx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
} 

export default config