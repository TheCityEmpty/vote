import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isCollapsed: state => state.sideStatus
    })
  },

  methods: {
    ...mapMutations([
      'setSideStatus'
    ])
  }
}
