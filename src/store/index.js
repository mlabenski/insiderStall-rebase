import Vue from 'vue'
import Vuex from 'vuex'
import { db, auth } from '@/services/firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: null,
    stalls: [],
    currentFloor: 1,
    currentGender: 'f'
  },
  getters: {
      getStallsByFloor: (state) => (floorNumber, gender) => {
          return state.stalls.filter(stall => stall.floor === floorNumber && stall.gender === gender)
      },
      getStallWithState: (state) => {
        return state.stalls.filter(stall => stall.floor === state.currentFloor && stall.gender === state.currentGender)
      },
      getCurrentFloor: (state) => {
        return state.currentFloor;
      },
      getCurrentGender: (state) => {
        return state.currentGender;
      }
  },
  mutations: {
    SET_CURRENT_USER: (state, payload) => { state.currentUser = payload },
    SET_STALLS: (state, payload) => { state.stalls = payload },
    set_current_floor_increment: (state) => {state.currentFloor++},
    set_current_floor_decrement: (state) => {state.currentFloor--},
    set_current_gender: (state, payload) => { state.currentGender = payload; console.log('the current gender in vuex is: ' +state.currentGender)},
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
      },
      increaseFloor(context) {
        context.commit('set_current_floor_increment')
      },
      decreaseFloor(context) {
        context.commit('set_current_floor_decrement')
      },
      updateGender(context, value) { context.commit('set_current_gender', value)}
    }
})

export default store;