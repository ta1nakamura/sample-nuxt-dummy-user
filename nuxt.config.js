const pkg = require('./package')

const nodeExternals = require('webpack-node-externals')
//add for API
const bodyParser = require('body-parser')
const session = require('express-session')
//setBaseURL for Axios
var env = process.env.NODE_ENV || 'development';
if (env === 'development' || env === 'test') {
  var API_URL='http://localhost:3000'
}
else{
  var API_URL=process.env.API_URL
}

module.exports = {
  mode: 'universal',
   /**
    * add for API
    */
  serverMiddleware:[
    bodyParser.json(),
    session({
      secret: 'sakaela',
      resave: false,
      saveUninitialized: false,
      cookie            : {
        // maxAge : 1000 * 60 * 60 * 24 * 30, // 30日
        maxAge : 1000 * 60 * 60, // 60min
      }
    }),
    '~/api'
  ],

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: [
    'vuetify/src/stylus/main.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL:API_URL
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
      // if (ctx.isServer) {
      if (process.server) {
        console.log('--nuxt.config.js extend')
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
