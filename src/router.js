import Router from 'vue-router'

const Login = () => import('./views/Login.vue')
const SMSLogin = () => import('./views/SMSLogin.vue')
const Register = () => import('./views/Register.vue')

const Home = () => import('./views/Home.vue')
const Study = () => import('./views/Study.vue')
const MyProfile = () => import('./views/myProfile.vue')
const Leaderboard = () => import('./views/Leaderboard.vue')
const FreeArea = () => import('./views/FreeArea.vue')
const Search = () => import('./views/Search.vue')
const SectionMore = () => import('./views/SectionMore.vue')
const PersonalInfo = () => import('./views/PersonalInfo.vue')
const SetPassword = () => import('./views/SetPassword.vue')
const BindPhone = () => import('./views/BindPhone.vue')
const SwitchPhone = () => import('./views/SwitchPhone.vue')
const Favorites = () => import('./views/Favorites.vue')
const Course = () => import('./views/Course.vue')
const Feedback = () => import('./views/Feedback.vue')
const ExpertIntro = () => import('./views/ExpertIntro.vue')
const CouponCenter = () => import('./views/CouponCenter.vue')
const CouponFailure = () => import('./views/CouponFailure.vue')
const AudioCourse = () => import('./views/AudioCourse.vue')
const PurchasedCourse = () => import('./views/PurchasedCourse.vue')
const CouponList = () => import('./views/CouponList.vue')
const PromotionCenter = () => import('./views/PromotionCenter.vue')
const BrowsingHistory = () => import('./views/BrowsingHistory.vue')
const LiveCourse = () => import('./views/LiveCourse.vue')
const RevenueBreakdown = () => import('./views/RevenueBreakdown.vue')
const VerifyPhone = () => import('./views/VerifyPhone.vue')
const IdentityAuth = () => import('./views/IdentityAuth.vue')
const Withdraw = () => import('./views/Withdraw.vue')
const ResetPwd = () => import('./views/ResetPwd.vue')
const WithdrawalApplication = () => import('./views/WithdrawalApplication.vue')
const MyRoom = () => import('./views/MyRoom.vue')

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
     path: '/',
     name: 'root',
     redirect: '/home'
    }, {
      path: '/login/:courseUUID?/:shareUUID?',
      name: 'Login',
      component: Login,
      meta: {}
    }, {
      path: '/SMSLogin',
      name: 'SMSLogin',
      component: SMSLogin,
      meta: {}
    }, {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {}
    }, {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard,
      meta: {}
    }, {
      path: '/freearea',
      name: 'FreeArea',
      component: FreeArea,
      meta: {}
    }, {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {}
    }, {
      path: '/sectionMore/:data',
      name: 'SectionMore',
      component: SectionMore,
      meta: {}
    }, {
      path: '/personalInfo',
      name: 'PersonalInfo',
      component: PersonalInfo,
      meta: {}
    }, {
      path: '/setPassword/:tel',
      name: 'SetPassword',
      component: SetPassword,
      meta: {}
    }, {
      path: '/bindPhone',
      name: 'BindPhone',
      component: BindPhone,
      meta: {}
    }, {
      path: '/switchPhone/:tel',
      name: 'SwitchPhone',
      component: SwitchPhone,
      meta: {}
    }, {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites,
      meta: {}
    }, {
      path: '/course/:uuid',
      name: 'Course',
      component: Course,
      meta: {}
    }, {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
      meta: {}
    }, {
      path: '/expertIntro/:uuid',
      name: 'ExpertIntro',
      component: ExpertIntro,
      meta: {}
    }, {
      path: '/couponCenter',
      name: 'CouponCenter',
      component: CouponCenter,
      meta: {}
    }, {
      path: '/couponFailure',
      name: 'CouponFailure',
      component: CouponFailure,
      meta: {}
    }, {
      path: '/audioCourse/:uuid/:playIndex?',
      name: 'AudioCourse',
      component: AudioCourse,
      meta: {}
    }, {
      path: '/purchasedCourse',
      name: 'PurchasedCourse',
      component: PurchasedCourse,
      meta: {}
    }, {
      path: '/couponList/:uuid',
      name: 'CouponList',
      component: CouponList,
      meta: {}
    }, {
      path: '/promotionCenter',
      name: 'PromotionCenter',
      component: PromotionCenter,
      meta: {}
    }, {
      path: '/browsingHistory',
      name: 'BrowsingHistory',
      component: BrowsingHistory,
      meta: {}
    }, {
      path: '/liveCourse/:type/:uuid',
      name: 'LiveCourse',
      component: LiveCourse,
      meta: {}
    }, {
      path: '/revenue',
      name: 'RevenueBreakdown',
      component: RevenueBreakdown,
      meta: {}
    }, {
      path: '/verifyPhone/:isFirst',
      name: 'VerifyPhone',
      component: VerifyPhone,
      meta: {}
    }, {
      path: '/identityAuth',
      name: 'IdentityAuth',
      component: IdentityAuth,
      meta: {}
    }, {
      path: '/withdraw/:money',
      name: 'Withdraw',
      component: Withdraw,
      meta: {}
    }, {
      path: '/resetPwd',
      name: 'ResetPwd',
      component: ResetPwd,
      meta: {}
    }, {
      path: '/withdrawalApplication',
      name: 'WithdrawalApplication',
      component: WithdrawalApplication,
      meta: {}
    }, {
      path: '/myRoom',
      name: 'MyRoom',
      component: MyRoom,
      meta: {}
    }, {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        deepth: 1,
        tabbar: true
      }
    }, {
      path: '/study',
      name: 'Study',
      component: Study,
      meta: {
        deepth: 2,
        tabbar: true
      }
    }, {
      path: '/myProfile',
      name: 'MyProfile',
      component: MyProfile,
      meta: {
        deepth: 3,
        tabbar: true
      }
    }
  ]
})
