<template>
<div id="app">
    <div v-if="showTabbar" class="tab-bar-wrapper">
      <van-tabbar route active-color="#FF6B88" inactive-color="#CCCCCC">
        <van-tabbar-item v-for="(item, index) in items" :key="index" :to="item.path">
          <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal"/>
          <span>{{ item.label }}</span>
        </van-tabbar-item>
      </van-tabbar>
    </div>
    <keep-alive include="home,study">
      <router-view/>
    </keep-alive>
    <!-- <transition
      v-bind:css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"

      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <keep-alive include="home,study">
        <router-view/>
      </keep-alive>
    </transition> -->
  </div>
</template>
<script>
export default {
  data: () => ({
    SPEED: 300,
    transitionTypes: ['slide-right', 'slide-left'],
    transitionType: '',
    showTabbar: false,
    items: [
      { name: 'home', label: '主页', normal: require('@/assets/images/home.png'), active: require('@/assets/images/home_select.png'), path: '/home' },
      { name: 'study', label: '学习', normal: require('@/assets/images/learn.png'), active: require('@/assets/images/learn_select.png'), path: '/study' },
      { name: 'myProfile', label: '我的', normal: require('@/assets/images/my.png'), active: require('@/assets/images/my_select.png'), path: '/myProfile' }
    ]
  }),
  computed: {
    horizontal() {
      return this.transitionTypes.includes(this.transitionType)
    }
  },
  methods: {
    beforeEnter($el) {
      if (this.horizontal) {
        const x = this.transitionType === 'slide-right' ? '-100%' : '100%'
        $el.style.cssText = `
          transition: transform ${this.SPEED}ms;
          transform: translate(${x}, 0);
        `
      }
    },
    enter($el, done) {
      if (this.horizontal) {
        window.requestAnimationFrame(() => {
          $el.style.cssText = `
            transition: transform ${this.SPEED}ms;
            transform: translate(0%, 0);
            z-index: 1
          `
        })
        const evTransitionEnd = window.ontransitionend ? 'transitionend' : 'webkitTransitionEnd'
        window.addEventListener(evTransitionEnd, function end() {
          window.removeEventListener(evTransitionEnd, end)
          done()
        })
      }
    },
    afterEnter($el) {

      $el.style.cssText = ''
    },

    beforeLeave($el) {
      if (this.horizontal) {
        $el.style.cssText = `
          transition: transform ${this.SPEED}ms;
          transform: translate(0%, 0);
        `
      }
    },
    leave($el, done) {
      if (this.horizontal) {
        const x = this.transitionType === 'slide-right' ? '100%' : '-100%'
        window.requestAnimationFrame(() => {
          $el.style.cssText = `
            transition: transform ${this.SPEED}ms;
            transform: translate(${x}, 0);
            z-index: 2
          `
        })
        const evTransitionEnd = window.ontransitionend ? 'transitionend' : 'webkitTransitionEnd'
        window.addEventListener(evTransitionEnd, function end() {
          window.removeEventListener(evTransitionEnd, end)
          done()
        })
      }
    },
    afterLeave($el) {
      $el.style.cssText = ''
    }
  },
  mounted() {
    // if(localStorage.getItem('percentage') == null){ localStorage.setItem("percentage", JSON.stringify([])); }
  },
  watch: {
    '$route': {
      immediate: true,
      deep: true,
      handler(to, from) {
        this.showTabbar = to.meta && to.meta.tabbar

        if (to.meta && to.meta.transitionType) {
          this.transitionType = to.meta.transitionType
        }
        else {
          if (to.meta && from && from.meta) {
            let toDeepth = to.meta.deepth
            let fromDeepth = from.meta.deepth

            if (typeof toDeepth === 'undefined' || typeof fromDeepth === 'undefined') {
              this.transitionType = ''
            }
            else {
              if (toDeepth >= fromDeepth) {
                this.transitionType = 'slide-left'
              } else {
                this.transitionType = 'slide-right'
              }
            }
          }
          else {
            this.transitionType = ''
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.tab-bar-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 9;
}
</style>
