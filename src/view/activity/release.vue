<template>
  <div class="release">
    <BreadcrumbBox :title="pageType ? '编辑活动 ( 编辑 )' : '发布活动 ( 添加 )'" :breadcrumbItem="breadcrumbItem">
    </BreadcrumbBox>
    <div class="box_wrap">
      <div class="status-radios">
        <span class="radios-title">活动是否开启：</span>
        <RadioGroup v-model="activityType" class="oneRadio">
          <Radio :label="1">开启</Radio>
          <Radio :label="0">关闭</Radio>
        </RadioGroup>
        <span class="radios-title">是否开启报名：</span>
        <RadioGroup v-model="signUpStatus" class="oneRadio">
          <Radio :label="1">开启</Radio>
          <Radio :label="0">关闭</Radio>
        </RadioGroup>
        <span class="radios-title">是否开启送礼物：</span>
        <RadioGroup v-model="giftStatus" class="oneRadio">
          <Radio :label="1">开启</Radio>
          <Radio :label="0">关闭</Radio>
        </RadioGroup>
      </div>

      <p class="lxh-title-2">活动标题：</p>
      <Input v-model="name" class="input-block"></Input>

      <p class="lxh-title-2">备注：</p>
			<Input v-model="note" class="input-block"></Input>

      <p class="lxh-title-2">微信描述：(限200字以内,显示在分享、回复关键词图文中)</p>
			<Input v-model="content" class="input-block"></Input>

      <p class="lxh-title-2">访问量：</p>
			<InputNumber :min="0" style="display: block;width: 100%;" :precision="0" v-model="visits" class="input-block"></InputNumber>

			<UploadPicBox
        title="缩略图"
        :defaultList="imgsDefault"
        class="input-block"
        @getSingleImgBase64="getSingleImgBase64"
        @removeSingleImgBase64="removeSingleImgBase64">
      </UploadPicBox>

      <p class="lxh-title-2">顶部滚动文字（公告）：</p>
      <Input v-model="notice" class="input-block" type="textarea" :rows="4"></Input>

      <!-- <p class="lxh-title-2">虚拟人气设置：</p>
			<Input v-model="remark" class="input-block"></Input> -->
      <p>选择时间的时候请选择正确的时间，活动结束时间必须大于活动开始时间，投票结束时间必须大于投票开始时间（否则活动不一定能按期开始）  </p>
      <div class="date">
        <div class="date-list">
          <p class="lxh-title-2">活动开始时间：</p>
          <DatePicker v-model="activityStartTime" type="datetime" placeholder="选择开始时间" style="width: 200px"></DatePicker>
        </div>
        <div class="date-list">
          <p class="lxh-title-2">活动结束时间：</p>
          <DatePicker v-model="activityEndTime" type="datetime" placeholder="选择结束时间" style="width: 200px"></DatePicker>
        </div>
        <div class="date-list">
          <p class="lxh-title-2">投票开始时间：</p>
          <DatePicker v-model="voteStartTime" type="datetime" placeholder="选择开始时间" style="width: 200px"></DatePicker>
        </div>
        <div class="date-list">
          <p class="lxh-title-2">投票结束时间：</p>
          <DatePicker v-model="voteEndTime" type="datetime" placeholder="选择结束时间" style="width: 200px"></DatePicker>
        </div>
      </div>

      <p class="lxh-title-2">活动广告（1～5张）：</p>

      <UploadPicBox
        class="input-block"
        :defaultList="adImgDefault"
        multiple
        @getImgBase64s="getImgBase64s"
        @removeImgBase64s="removeImgBase64s">
      </UploadPicBox>

      <div class="input-block">
        <p class="lxh-title-2">模板界面风格：</p>
        <Select v-model="model" style="width:200px">
          <Option v-for="item in modelStyles" :value="item.value" :key="item.value">{{ item.title }}</Option>
        </Select>
      </div>

      <!-- <Upload
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png','gif']"
        :max-size="2048"
        multiple
        action="/file/upload"
        >
        <Button icon="ios-cloud-upload-outline" ></Button>
      </Upload> -->

      <UploadPicBox
        style="display: none;"
        title="缩略图"
        class="input-block"
        ref="editePic"
        @getSingleImgBase64="getEidImg">
      </UploadPicBox>

      <p class="lxh-title-2">投票活动规则填写：</p>
      <quill-editor
        class="input-block"
        v-model.trim="rule"
        ref="myQuillEditor"
        :options="editorOption">
        <!-- @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)" -->
      </quill-editor>

      <p class="lxh-title-2">奖品内容填写：</p>
      <quill-editor
        v-model.trim="prize"
        ref="myQuillEditor2"
        :options="editorOption2">
        <!-- @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"> -->
      </quill-editor>

      <Button type="primary" style="margin-top: 30px;" @click="submit">提交</Button>
		</div>

    <div class="fixed-editor-img-attr-control">
      <Icon type="md-close" class="close" title="点击关闭弹窗" @click="closeFixed" />
      <p class="lxh-title">设置图片宽高</p>
      <p>px 为图片像素（一种单位）， % 为 占输入框的比率</p>
        <Input v-model="width" style="margin-bottom: 10px;">
          <span slot="prepend">宽：</span>
          <Select v-model="widthUnit" slot="append" style="width: 40px">
            <Option value="px">px</Option>
            <Option value="%">%</Option>
          </Select>
        </Input>
        <Button type="primary" style="margin-bottom: 30px;" @click="changeImgWidth(width)">改宽</Button>

        <Input v-model="height" style="margin-bottom: 10px;">
          <span slot="prepend">高：</span>
          <Select v-model="heightUnit" slot="append" style="width: 40px">
            <Option value="px">px</Option>
            <Option value="%">%</Option>
          </Select>
        </Input>
        <Button type="primary" style="margin-bottom: 30px;" @click="changeImgHeight(height)">改高</Button>
    </div>
  </div>
</template>

<script>
// 工具栏配置
import './activity.scss'
import UploadPicBox from '@_com/uploadPic/uploadPic.vue'
import { dateToTimeStamp, timeStampToDate } from '@/libs/tools.js'
import { createActivity, queryActivity, updateActivity, putImg, queryStatistics } from '@/api'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
]
export default {
  components: {
    UploadPicBox
  },
  data () {
    return {
      widthUnit: 'px',
      heightUnit: 'px',
      width: '',
      height: '',
      editorOption: {
        placeholder: '请输入',
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': (value) => {
                if (value) {
                  this.$refs['editePic'].upload('editor')
                } else {
                  console.log('aa')
                }
              }
            }
          }
        }

      },
      editorOption2: {
        placeholder: '请输入',
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': (value) => {
                if (value) {
                  this.$refs['editePic'].upload('editor2')
                } else {
                  console.log('aa')
                }
              }
            }
          }
        }

      },
      // form start
      activityType: 1,
      giftStatus: 1,
      signUpStatus: 1,
      name: '',
      note: '',
      content: '',
      imgs: [],
      notice: '',
      activityStartTime: '',
      activityEndTime: '',
      voteStartTime: '',
      voteEndTime: '',
      adImg: [],
      model: '',
      rule: '',
      prize: '',
      visits: 0,
      // form end
      status: 'start',
      breadcrumbItem: [
        {
          title: '活动管理',
          to: '/activity'
        },
        {
          title: '操作活动'
        }
      ],
      modelStyles: [
        {
          title: '默认模板',
          value: '1'
        }
      ],
      currentImgDom: '',
      // 页面处于编辑还是新建
      pageType: false,
      imgsDefault: '',
      adImgDefault: ''
    }
  },

  watch: {
    prize () {
      let DOM1 = document.querySelectorAll('.ql-editor')[1]
      if (DOM1.querySelectorAll('img').length) {
        let imgDOMs = DOM1.querySelectorAll('img')
        Array.prototype.forEach.call(imgDOMs, (item) => {
          item.addEventListener('click', () => {
            this.currentImgDom = item
            let e = event || window.event
            let position = { 'x': e.clientX, 'y': e.clientY }
            this.setFixedPosition((position.y + 'px'), (position.x + 'px'))
          })
        })
      }
    },
    rule () {
      let DOM1 = document.querySelectorAll('.ql-editor')[0]
      if (DOM1.querySelectorAll('img').length) {
        let imgDOMs = DOM1.querySelectorAll('img')
        Array.prototype.forEach.call(imgDOMs, (item) => {
          item.addEventListener('click', () => {
            this.currentImgDom = item
            let e = event || window.event
            let position = { 'x': e.clientX, 'y': e.clientY }
            this.setFixedPosition((position.y + 'px'), (position.x + 'px'))
          })
        })
      }
    }
  },

  created () {
    let id = this.$route.query.id
    let type = this.$route.query.type
    if (id) {
      // type 为2 编辑  为1 复制活动
      if (Number(type) === 2) {
        this.pageType = true
      } else {
        this.pageType = false
      }
      this.queryActivity(id)
    } else {
      this.pageType = false
    }
  },

  beforeCreate () {
    queryStatistics()
  },

  methods: {

    getEidImg (obj) {
      putImg({
        base: obj.base
      }).then(res => {
        if (String(res.code) !== '2') {
          // 获取光标所在位置
          let quill = null
          if (obj.type === 'editor') {
            quill = this.$refs.myQuillEditor.quill
          } else {
            quill = this.$refs.myQuillEditor2.quill
          }
          let length = quill.getSelection().index
          // 插入图片，res.data为服务器返回的图片链接地址
          quill.insertEmbed(length, 'image', res.data)
          // 调整光标到最后
          quill.setSelection(length + 1)
        }
      })
    },
    queryActivity (id) {
      queryActivity({ id: id }).then(result => {
        let res = result.data
        this.activityType = res.activityType
        this.giftStatus = res.giftStatus
        this.signUpStatus = res.signUpStatus
        this.name = res.name
        this.note = res.note
        this.content = res.content
        this.imgsDefault = res.img
        this.notice = res.notice
        this.activityStartTime = timeStampToDate(res.activityStartTime)
        this.activityEndTime = timeStampToDate(res.activityEndTime)
        this.voteStartTime = timeStampToDate(res.voteStartTime)
        this.voteEndTime = timeStampToDate(res.voteEndTime)
        this.adImgDefault = res.adImg
        this.model = res.model
        this.rule = res.rule
        this.prize = res.prize
        this.visits = res.visits
      })
    },
    removeImgBase64s (id) {
      let index = this.adImg.findIndex(item => item.id === id)
      this.adImg.splice(index, 1)
    },
    getImgBase64s (base64) {
      if (base64.length) {
        this.adImg = base64
      } else {
        this.adImg.push(base64)
      }
    },
    removeSingleImgBase64 () {
      this.imgs = []
    },
    getSingleImgBase64 (base64) {
      this.imgs.push(base64)
    },
    changeImgWidth (width) {
      let readlyWidth = width
      if (this.widthUnit === 'px') {
        readlyWidth = readlyWidth + 'px'
      } else {
        readlyWidth = readlyWidth + '%'
      }
      this.currentImgDom.style.width = readlyWidth
    },
    changeImgHeight (height) {
      let readlyHeight = height
      if (this.widthUnit === 'px') {
        readlyHeight = readlyHeight + 'px'
      } else {
        readlyHeight = readlyHeight + '%'
      }
      this.currentImgDom.style.height = readlyHeight
    },
    setFixedPosition (top, left) {
      let fixedDom = document.querySelectorAll('.fixed-editor-img-attr-control')
      fixedDom[0].style.top = top
      fixedDom[0].style.left = left
    },
    closeFixed () {
      this.setFixedPosition('10000px', '10000px')
    },
    submit () {
      if (!this.name || !this.note || !this.content || !this.imgs.length || !this.notice || !this.activityStartTime ||
      !this.activityEndTime || !this.voteStartTime || !this.voteEndTime || !this.adImg.length || !this.model ||
      !this.rule || !this.prize) {
        this.$Message.warning('请全部填写')
        return
      }
      let params = {}
      // 修改
      if (this.pageType) {
        params = {
          activityType: this.activityType,
          giftStatus: this.giftStatus,
          signUpStatus: this.signUpStatus,
          name: this.name,
          note: this.note,
          content: this.content,
          img: this.imgs,
          notice: this.notice,
          activityStartTime: dateToTimeStamp(this.activityStartTime),
          activityEndTime: dateToTimeStamp(this.activityEndTime),
          voteStartTime: dateToTimeStamp(this.voteStartTime),
          voteEndTime: dateToTimeStamp(this.voteEndTime),
          adImg: this.adImg.map(item => item.val),
          model: this.model,
          rule: this.rule,
          prize: this.prize,
          visits: this.visits || 0
        }
      } else {
        // x新增
        params = {
          activityType: this.activityType,
          giftStatus: this.giftStatus,
          signUpStatus: this.signUpStatus,
          name: this.name,
          note: this.note,
          content: this.content,
          imgs: this.imgs,
          notice: this.notice,
          activityStartTime: dateToTimeStamp(this.activityStartTime),
          activityEndTime: dateToTimeStamp(this.activityEndTime),
          voteStartTime: dateToTimeStamp(this.voteStartTime),
          voteEndTime: dateToTimeStamp(this.voteEndTime),
          adImg: this.adImg.map(item => item.val),
          model: this.model,
          rule: this.rule,
          prize: this.prize,
          visits: this.visits || 0
        }
      }
      console.log(params)

      this.$Modal.confirm({
        content: `是否${this.pageType ? '修改' : '提交'}该活动？`,
        onOk: () => {
          this.setGlobalLoading(true)
          if (this.pageType) {
            let id = this.$route.query.id
            updateActivity({
              ...params,
              id: id
            }).then(res => {
              this.$Message.info(`修改活动成功`)
              this.queryActivity(id)
            }).finally(() => { this.setGlobalLoading(false) })
          } else {
            createActivity(params).then(res => {
              if (Number(res.code) === 2) {
                this.$Message.info(`新建活动失败`)
              } else {
                this.$Message.info(`新建活动成功`)
                this.$router.go(-1)
              }
            }).finally(() => { this.setGlobalLoading(false) })
          }
        }
      })
    }
  }
}
</script>
