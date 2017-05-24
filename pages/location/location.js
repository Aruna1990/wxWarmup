//location.js
var app = getApp()
Page({
  data: {
    isMoving: false,
    currentAccelerometer: {
      x: 0,
      y: 0,
      z: 0
    },
    timer: null,
    latitude: 0,
    longitude: 0,
    markers: [],
    polyline: [{
      points: [{
        latitude: 39.9040,
        longitude: 116.414520,
      }, {
        latitude: 39.809994,
        longitude: 116.404520,
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    lastLogId: 'item-0',
    controls: [{
      id: 1,
      iconPath: '/imgs/cry.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  handleStart(){
      this.initLocation();
  },
  handleStop(){
      clearInterval(this.data.timer);
      let endPoint = this.data.markers.pop();
      this.setData({
          timer: null,
          markers: [
            ...this.data.markers,
            Object.assign({}, endPoint, {
                iconPath: '/imgs/endpoint.png',
                width: 50,
                height: 50
            })
          ]
      });
  },
  initLocation(){
      const self = this;
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function(res){
            console.log(res);
          const {latitude, longitude, speed, accuracy, altitude} = res;
          self.setData({
            latitude,
            longitude,
            markers: [{
                iconPath: "/imgs/startpoint.png",
                id: 0,
                latitude,
                longitude,
                width: 50,
                height: 50
            }],
            polyline: [{
              points: [{
                latitude,
                longitude,
              }, {
                latitude,
                longitude,
              }],
              color:"#FF0000DD",
              width: 2,
              dottedLine: true
            }],
          })
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      });
      if(this.data.timer){
        clearInterval(this.data.timer);
      }
      
      let timer = setInterval(() => {
          console.log(self.data.polyline);
        wx.getLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: function(res){
                let {latitude, longitude, speed, accuracy, altitude} = res;

                let randomNum1 = Math.floor(Math.random()*100),
                    randomNum2 = Math.floor(Math.random()*100),
                    delta = 0.0001;
                
                randomNum1 = randomNum1 % 2 ? randomNum1 : 0 - randomNum1;
                randomNum2 = randomNum2 % 2 ? randomNum2 : 0 - randomNum2;

                longitude = (longitude + randomNum1 * delta).toFixed(5);
                latitude = (latitude + randomNum2 * delta).toFixed(5);
                self.setData({
                    markers: [
                        ...self.data.markers,
                        {
                            iconPath: "/imgs/toy.png",
                            id: self.data.markers.length,
                            latitude,
                            longitude,
                            width: 10,
                            height: 10
                        }
                    ],
                    polyline: [
                        ...self.data.polyline,
                        {
                          points: [
                            self.data.polyline[self.data.polyline.length-1].points[1], {
                              longitude,
                              latitude
                            }
                          ],
                          color:"#FF0000DD",
                          width: 2,
                          dottedLine: true
                        }
                    ],
                    lastLogId: `item-${self.data.polyline[0].points.length-1}`
                });
            },
            fail: function() {
            // fail
            },
            complete: function() {
            // complete
            }
        });
      }, 2000);
      this.setData({
          timer,
      })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });
    this.initLocation();
    this.startAccelerometer();
  },
  onHide(){
      clearInterval(this.data.timer);
      this.setData({
          timer: null
      });
  },
  onShow(){
      const self = this;
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function(res){
          
          self.setData({
              center: {

              }
          })
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },
  startAccelerometer(){
    const self = this;
    wx.onAccelerometerChange(function(res){
      console.log(res.x, res.y, res.z);
      const {x, y, z} = self.data.currentAccelerometer;

      if(Math.abs(res.x - x) > 1 || Math.abs(res.y - y) > 1 || Math.abs(res.z - z) > 1){
        self.setData({
          isMoving: true
        })
      } else {
        self.setData({
            isMoving: false
        });
      }
    })
  }
})
