<template>
  <v-app dark>  
    <!-- [toolbar] -->
    <v-toolbar dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
      <!-- *manu -->
      <v-toolbar-title class="white--text">dummyUser</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="item in items" :key="item.title" :to="item.url" flat>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      
     
    </v-toolbar>
    <!-- ***[Left Menu]***  -->
    <v-navigation-drawer v-model="drawer" fixed app>
      <!-- [User left] -->
      <v-toolbar flat @click.stop="drawer = !drawer">
        <v-list>
          <v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <!-- <img v-if="currentUser" :src="currentUser.picture">
                <v-icon v-else medium>account_circle</v-icon> -->
                <v-icon medium>account_circle</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="title">
                  <span v-if="currentUser">{{ currentUser.displayname }}</span>
                  <span v-else>No Sigin</span>
                  <!-- <span>No Sigin</span> -->
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-tile>
        </v-list>
      </v-toolbar>
  
      <!-- [Items Menus [Home,Feature,Contact]]-->
      <v-list dense class="pt-0">
        <v-list-tile v-for="item in items" :key="item.title" :to="item.url">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> 

    <!-- ***[contents]*** -->
    <nuxt />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: "HOME", icon: "home", url: "/" },
        { title: "todolist", icon: "assignment", url: "/dashboard" },
        { title: "somelist", icon: "assignment", url: "/" },
        { title: "setting", icon: "build", url: "/" }
      ]
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser
      // if(this.$store.getters.isAuthenticated){
      //   return this.$store.getters.currentUser;
      // }
      // else{
      //   return null;
      // }
    }
  }
}
</script>
