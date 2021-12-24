import Vue from 'vue'
import Vuex from 'vuex'
import { db, auth } from '@/services/firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: null,
    stalls: [],
    currentFloor: null,
    currentGender: null
  },
  getters: {
      getStallsByFloor: (state) => (floorNumber) => {
          return state.stalls.filter(stall => stall.floor === floorNumber)
      }
  },
  mutations: {
    SET_CURRENT_USER: (state, payload) => { state.currentUser = payload },
    SET_STALLS: (state, payload) => { state.stalls = payload }
  },
  actions: {
      loadAllStalls({commit}) {
        let tmp = []
        db.collection("stall_id")
        .get()
        .then((qs) => { qs.forEach((doc) => { tmp.push({ ...doc.data() }) }) })
        .catch((error) => { console.log("Error getting documents: ", error); });
        commit('SET_STALLS', tmp)
      },
      loginUser({commit}) {
        auth.signInAnonymously()
        .then(() => {
          auth.onAuthStateChanged((user) => {
            if (user) { commit('SET_CURRENT_USER', user.multifactor.user) } 
            else { commit('SET_CURRENT_USER', null) }
          });
        }).catch((error) => { console.error(error) });
      }
    }
})

export default store;