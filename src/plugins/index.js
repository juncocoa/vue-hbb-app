/**
 * 需要全局加载的ui插件建议在这里初始化
 */
import Vue from 'vue'
import Router from 'vue-router';
import EasyRefresh from 'vue-easyrefresh'
import {
  Tab,
  Row,
  Col,
  Step,
  Steps,
  Tabs,
  List,
  Image,
  Swipe,
  Popup,
  Radio,
  Toast,
  Slider,
  Circle,
  Sticky,
  Tabbar,
  Button,
  Dialog,
  Overlay,
  Uploader,
  Progress,
  Lazyload,
  SwipeCell,
  SwipeItem,
  TabbarItem,
  PullRefresh,
  Checkbox,
  RadioGroup,
  Loading,
  CheckboxGroup,
  PasswordInput,
  NumberKeyboard,
} from 'vant';

Vue.use(Lazyload);
Vue.use(Row).use(Col);
Vue.use(Tab).use(Tabs);
Vue.use(Step).use(Steps);
Vue.use(Swipe).use(SwipeItem);
Vue.use(Radio).use(RadioGroup);
Vue.use(Checkbox).use(CheckboxGroup);
Vue.use(PasswordInput).use(NumberKeyboard);
Vue.use(Router)
Vue.use(Circle)
Vue.use(Overlay)
Vue.use(Loading)
Vue.use(EasyRefresh)
Vue.use(List)
Vue.use(Popup)
Vue.use(Image)
Vue.use(Toast)
Vue.use(Slider)
Vue.use(Sticky)
Vue.use(Tabbar)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Uploader)
Vue.use(SwipeCell)
Vue.use(Progress)
Vue.use(TabbarItem)
Vue.use(PullRefresh)
