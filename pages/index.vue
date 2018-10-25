<template>
  <div>

    <!-- [main] -->
    <v-content>
      <v-container fluid>
        <h1> Nuxt App template </h1>
        <pre>
    - Nuxt 2.1
    - Vuetify module
    - Expless
    - Axios module
    - Mongdb,Mongoose
    - Heroku
    - 
    - dummyLogin (test for LINELOGIN)
    - TodoList
        </pre>
        <v-text-field v-model="dummyid" label="input dummy lineuserid"/>
        <v-btn @click="onDummyLogin()">Login</v-btn>
        <!-- <p>{{items}}</p> -->
        <hr>
        <h2>this.$store.getters.currentUser</h2>
        {{ currentUser }}
        <hr>
  

      </v-container>
    </v-content>
    <!-- [footer] -->
    <v-footer app inset>
      <span class="white--text">&copy; 2018 footer</span>
    </v-footer>

  </div>
</template>
<script>
export default {
  data() {
    return {
      dummyid: "test"
      // items:null
    }
  },
  async asyncData(context) {
    console.log("--asyncData")
    try {
      let data = await context.app.$axios.$get("/api/test/3")
      console.log(data)
    } catch (e) {
      console.log(e)
      context.error(e)
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser
    }
  },
  created() {
    console.log("--crated")
  },
  methods: {
    async onClickTest() {
      console.log("--onClickTest")
      try {
        let data = await this.$axios.$get("/api/todos")
        console.log(data)
        this.items = data.todos
      } catch (e) {
        console.log(e)
      }
    },
    async onDummyLogin() {
      console.log("--onDummyLogin")
      if (!this.dummyid) {
        console.log("no dumyid")
        return
      }
      try {
        let data = await this.$axios.$post("/api/dummylogin", {
          lineuserid: this.dummyid
        })
        console.log(data)
        this.$store.commit("setLineuser", data.lineuser)
      } catch (e) {
        console.log(e)
      }
    }
  } //end methods
}
</script>
