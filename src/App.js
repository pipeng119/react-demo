import React, {
  Component
} from 'react'

import Cesium from 'cesium/Cesium'
import Widgets from 'cesium/Widgets/widgets.css'


export default class App extends Component {
  constructor(){
    super()
    window.initFromPlugin = function(viewer){
      window.viewer = viewer
    }
  }
  componentDidMount() {
    if(process.env.NODE_ENV === "development") {
      window.Cesium = Cesium
      window.viewer = new window.Cesium.Viewer('cesiumContainer', {
        navigationHelpButton: false, //帮助按钮
        animation: false, //动画控制，默认true
        baseLayerPicker: true, //地图切换控件(底图以及地形图)是否显示,默认显示true
        fullscreenButton: false, //全屏按钮,默认显示true
        geocoder: false, //地名查找,默认true
        timeline: false, //时间线,默认true
        vrButton: false, //双屏模式,默认不显示false
        homeButton: true, //主页按钮，默认true
        infoBox: false, //点击要素之后显示的信息,默认true
        selectionIndicator: false, //选中元素显示,默认true
        sceneMode: window.Cesium.SceneMode.SCENE3D, //二三维切换，默认Cesium.SceneMode.SCENE3D,
        clockViewModel: new window.Cesium.ClockViewModel(this.initClock()),
        contextOptions: {
          webgl: {
            preserveDrawingBuffer: true
          }
        }
      });
      // this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels=[];
      window.viewer.baseLayerPicker.viewModel.selectedImagery = undefined;
      // 使用cesium默认图层
      let vms = window.viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
      window.viewer.baseLayerPicker.viewModel.selectedImagery = vms[vms.length - 1];
    }
    
  }
  initClock(){
    let now = window.Cesium.JulianDate.now();
    let start = new window.Cesium.JulianDate(now.dayNumber - 1200);
    let end = new window.Cesium.JulianDate(now.dayNumber + 1200);
    let clock = new window.Cesium.Clock({
      startTime: start,
      currentTime: now,
      stopTime: end,
      clockRange: window.Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
      clockStep: window.Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
      multiplier: 1, // how much time to advance each tick
      shouldAnimate: true, // Animation on by default
    });
    return clock;
  }
  render() {
    return (
      // <div id="cesiumContainer" style={{
      //   width:500,height:500,border:"1px solid black"
      // }}>
      <div className="wrapper">
        <div id="cesiumContainer"></div>
        <DrawCircle/>
      </div>
    )
  }
}
class DrawCircle extends Component {
  constructor(props) {
      super(props);
      // 事件监听函数
      this.drawCircle = this.drawCircle.bind(this);
      this.cancle = this.cancle.bind(this);
      // 初始状态
      this.state = { count: 0};
  }
  greenCircle;
  drawCircle() {
    this.greenCircle = window.viewer.entities.add({
        position: window.Cesium.Cartesian3.fromDegrees(-111.0, 40.0, 150000.0),
        name : 'Green circle at height with outline',
        ellipse : {
            semiMinorAxis : 300000.0,
            semiMajorAxis : 300000.0,
            height: 200000.0,
            material : window.Cesium.Color.GREEN,
            outline : true // height must be set for outline to display
        }
    });
    
  }
  cancle() {
    window.viewer.entities.remove(this.greenCircle);
  }

  render() {
      return (
          <div className="draw-wrapper">
              <button onClick={ this.drawCircle }> 画圆 </button>
              <button onClick={ this.cancle }> 删除 </button>
          </div>
      );
  }
}