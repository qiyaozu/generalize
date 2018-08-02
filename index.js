// 获取短信验证码
function get_code() {
  console.log('get code')
}

var globalConfig = {
  api: 'http://192.168.1.97:8886',
  verifyCode: 'http://192.168.1.97:6550'
};

var app = new Vue({
  el: '#app',
  data: {
    phone: '',
    code: '',        // 短信验证码
    getCode: {
      time: 60,
      status: true
    },
    price: 0,        // 金额
    discounts: 0,    // 优惠
  },

  computed: {
    markText() {
      if (this.getCode.status) return '获取验证码'
      else return `${this.getCode.time}s后重试`
    },
    canOpen() {
      if (this.phone.length === 11 && this.code.length === 6) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // 检查手机号
    checkPhone() {
      if (!this.phone) {
        //提示
        layer.open({
          content: '请输入手机号'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        return false
      } else if (this.phone.length < 11) {
        //提示
        layer.open({
          content: '手机号格式有误'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        return false
      }
      return true
    },

    // 发送验证码成功
    sendSucc() {
      //提示
      layer.open({
        content: '发送成功'
        , skin: 'msg'
        , time: 2 //2秒后自动关闭
      });
      let _time = this.getCode.time
      this.getCode.status = false
      this.timer = setInterval(() => {
        this.getCode.time--
        if (this.getCode.time < 1) {
          clearInterval(this.timer)
          this.getCode.status = true
          this.getCode.time = _time
        }
      }, 1000)
    },

    // 获取语音验证码
    getVoiceCode() {
      var _this = this;
      $.ajax({
        type: 'POST',
        url: `${globalConfig.verifyCode}/Activity/GetApiResult`,
        data: {
          phone: _this.phone,
          smsType: 1,
          codeWay: 1, // 0 短信 1 语音
          action: "getSmsCode"
        },
        dataType: 'json',
        timeout: 5000,
        success: function (res) {
          console.log(res.data);
          // 提示发送成功
          if (res.flag === 1) {
            _this.key = JSON.parse(res.rs).key;
            layer.open({
              content: '发送成功'
              , skin: 'msg'
              , time: 2 
            });
          } else {
            layer.open({
              content: `${res.msg}`
              , skin: 'msg'
              , time: 2 
            });
          }
        },
        error: function (xhr, type) {
          alert('Ajax error!')
        }
      })
    },

    // 获取短信验证码
    getVerifyCode() {
      if (!this.getCode.status) return
      if (!this.checkPhone()) return
      else {
        var _this = this;
        _this.sendSucc();
        // $.ajax({
        //   type: 'POST',
        //   url: `${globalConfig.verifyCode}/Activity/GetApiResult`,
        //   data: { 
        //     phone: _this.phone,
        //     smsType: 4,
        //     codeWay: 0, // 0 短信 1 语音
        //     action: "getSmsCode"
        //   },
        //   dataType: 'json',
        //   timeout: 5000,
        //   success: function (res) {
        //     if (res.flag === 1) {
        //       _this.key = JSON.parse(res.rs).key;
        //       //提示
        //       layer.open({
        //         content: '短信验证码发送成功'
        //         ,skin: 'msg'
        //         ,time: 2 //2秒后自动关闭
        //       });
        //       _this.sendSucc();
        //     } else {
        //       layer.open({
        //         content: ``
        //         ,skin: 'msg'
        //         ,time: 2 //2秒后自动关闭
        //       });
        //     }
        //   },
        //   error: function (xhr, type) {
        //     alert('Ajax error!')
        //   }
        // })
      }
    },


  }
});

$(function () {
  app.phone = 188
  // $.ajax({
  //   type: 'GET',
  //   url: '/projects',
  //   data: { name: 'Zepto.js' },
  //   dataType: 'json',
  //   timeout: 5000,
  //   success: function (data) {
  //   },
  //   error: function (xhr, type) {
  //     alert('Ajax error!')
  //   }
  // })

  // 获取数据成功之后，关闭loading 显示app

})