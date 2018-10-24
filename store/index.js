import Vuex from "vuex"
import { STATUS_CODES } from "http"
const SIGIN_TIMEOUT = 600

const createStore = () => {
  return new Vuex.Store({
    state: {
      lineuser: null, // ?, line object for access user
      todos: []
    },
    mutations: {
      setLineuser(state, user) {
        console.log("--[$sotre.mutations]setLineuser")
        state.lineuser = user
        // state.idToken = user.id_token
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        console.log("--[$sotre.nextServerInit]")
        if (context.req.session.lineuser) {
          // vuexContext.commit('setLineuser', context.req.session.lineuser)
          vuexContext.state.lineuser = context.req.session.lineuser
        } else {
          console.log("---[$sotre.nextServerInit] no lineuser")
        }
      },
      async addTodo(vuexContext, newTask) {
        const config = {
          headers: { "x-auth": vuexContext.state.lineuser.id_token }
        }
        try {
          const res = await this.$axios.post(
            "/api/todos",
            { text: newTask },
            config
          )
          vuexContext.dispatch("fetchTodo")
        } catch (err) {
          console.log(err)
        }
      },
      //[ChangeTodo]
      async changeTodo(vuexContext, todo) {
        const config = {
          headers: { "x-auth": vuexContext.state.lineuser.id_token }
        }
        try {
          const res = await this.$axios.patch(
            `/api/todos/${todo._id}`,
            { completed: !todo.completed },
            config
          )
          vuexContext.dispatch("fetchTodo")
        } catch (err) {
          console.log(err)
        }
      },
      //[fetchTodo]
      async fetchTodo(vuexContext) {
        console.log("--[fetchTodo]")
        const config = {
          headers: { "x-auth": vuexContext.state.lineuser.id_token }
        }
        try {
          const res = await this.$axios.get("/api/todos", config)
          vuexContext.state.todos = [] //clear todos
          for (var i = 0; i < res.data.todos.length; i++) {
            vuexContext.state.todos.push(res.data.todos[i])
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    getters: {
      todos(state) {
        return state.todos
      },
      currentUser(state) {
        return state.lineuser
      },
      isAuthenticated(state) {
        return state.lineuser != null
      }
    }
  })
}
export default createStore
