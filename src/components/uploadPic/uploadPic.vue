<template>
  <div class="uploadPic-box">
    <template v-if="!multiple">
      <p class="lxh-title-2">{{ title }}</p>
      <div class="file">
        <div class="img">
          <img :src="base64Img" v-if="base64Img" />
          <Icon type="md-image" v-else />
        </div>
        <button class="upload" @click="upload">上传</button>
        <button class="remove" @click="remove">移除</button>
        <input type="file" ref="file" @change="changeImage($event)">
      </div>
    </template>
    <template v-else>
      <div class="addImg" @click="upload">
        <Icon type="md-camera" />
        <span>添加图片</span>
        <input type="file" ref="file" multiple="multiple" @change="changeImages($event)">
      </div>
      <div class="imgs-list">
        <div class="imgs" v-for="(item, index) in base64Imgs" :key="index">
          <img :src="item.val" />
          <Icon type="md-close-circle" class="close" @click="removes(item.id)" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import './uploadPic.scss'
import { oneOf } from '@/libs/tools.js'
export default {
  props: {
    defaultList: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    accept: {
      type: Array,
      default () {
        return ['bmp', 'jpg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr',
          'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp']
      }
    }
  },
  data () {
    return {
      base64Img: '',
      base64Imgs: []
    }
  },

  watch: {
    defaultList (val) {
      // 单个图片 编辑
      if (this.defaultList && !this.multiple) {
        this.base64Img = JSON.parse(this.defaultList)[0]
        this.$emit('getSingleImgBase64', JSON.parse(JSON.stringify(this.base64Img)))
      }

      // 多个图片编辑
      if (this.defaultList && this.multiple) {
        this.base64Imgs = JSON.parse(this.defaultList).map((item, index) => {
          return {
            val: item,
            id: Date.now() + '-' + index
          }
        })
        this.$emit('getImgBase64s', JSON.parse(JSON.stringify(this.base64Imgs)))
      }
    }
  },

  methods: {
    changeImages (event) {
      // 上传错误格式后， 点击上传， 然后点击取消， 不知道咋回事还会执行这个方法， 下面一行为解决这个bug的方法
      if (!event.target.files.length) return

      let files = event.target.files

      if (this.base64Imgs.length >= 5) {
        this.$Message.warning(`最多上传5张图片!`)
        return
      }
      let filesArr = [...files]
      let fileExts = filesArr.map(item => item.name.split('.').pop().toLowerCase())
      if (fileExts.every(item => !oneOf(item, this.accept))) {
        this.$Message.warning(`请上传${this.accept.join(', ')}类型图片!`)
        return
      }
      // 创建fileReader对象
      var reader = new FileReader()

      // 图片编码完成
      reader.readAsDataURL(files[0])
      // onloadend 为异步函数 解析图片 成base 64位的图片 用fileReader的readAsDataURL 去读本地图片对象
      let fileLength = 0
      reader.onloadend = (e) => {
        if (e.target.result) {
          this.$emit('getImgBase64s', JSON.parse(JSON.stringify({
            val: e.target.result,
            id: Date.now() + '-' + fileLength
          })))
          this.base64Imgs.push({
            val: e.target.result,
            id: Date.now() + '-' + fileLength
          })
          fileLength++
          if (fileLength < files.length) {
            reader.readAsDataURL(files[fileLength])
          }
        }
      }
    },
    removes (id) {
      let index = this.base64Imgs.findIndex(item => item.id === id)
      this.base64Imgs.splice(index, 1)
      this.$emit('removeImgBase64s', id)
    },
    remove () {
      this.base64Img = ''
      this.$emit('removeSingleImgBase64')
    },
    upload () {
      if (this.base64Img || this.base64Imgs.length > 5) {
        this.$Message.warning('已上传图片，请移除图片后再次上传！')
        return
      }
      this.$refs.file.click()
    },
    changeImage (event) {
      // 上传错误格式后， 点击上传， 然后点击取消， 不知道咋回事还会执行这个方法， 下面一行为解决这个bug的方法
      if (!event.target.files.length) return
      let file = event.target.files[0]
      let fileExt = file.name.split('.').pop().toLowerCase()
      if (!oneOf(fileExt, this.accept)) {
        this.$Message.warning(`请上传${this.accept.join(', ')}类型图片!`)
        return
      }
      // 创建fileReader对象
      var reader = new FileReader()
      // 图片编码完成
      reader.readAsDataURL(file)
      // onloadend 为异步函数 解析图片 成base 64位的图片 用fileReader的readAsDataURL 去读本地图片对象
      reader.onloadend = (e) => {
        this.base64Img = e.target.result
        this.$emit('getSingleImgBase64', JSON.parse(JSON.stringify(this.base64Img)))
      }
    }
  }
}
</script>
