<template>
	<div class="addSignUp-box">
		<BreadcrumbBox :title="pageType ? '编辑报名人 ( 编辑 )' : '添加报名人 ( 添加 )'" :breadcrumbItem="breadcrumbItem">
    </BreadcrumbBox>
    <div class="box_wrap">
			<div class="input-block">
        <p class="lxh-title-2">活动主题：</p>
         <Alert>活动名称:{{ $route.query.name }}</Alert>
        <!-- <Select v-model="activityId" style="width: 500px;">
          <Option v-for="item in activitys" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select> -->
      </div>

      <p class="lxh-title-2">备注：</p>
			<Input v-model="note" class="input-block"></Input>

			<p class="lxh-title-2">姓名：</p>
			<Input v-model="name" class="input-block"></Input>

			<!-- <p class="lxh-title-2">虚拟票数：</p> -->
			<!-- <InputNumber :min="0" style="display: block;width: 100%;" :precision="0" v-model="virtualTicket" class="input-block"></InputNumber> -->

			<p class="lxh-title-2">手机号：</p>
			<Input v-model="phone" class="input-block"></Input>

			<p class="lxh-title-2">地址：</p>
			<Input v-model="address" class="input-block"></Input>

			<p class="lxh-title-2">参赛照片（1～5张）：</p>

      <UploadPicBox
        class="input-block"
        :defaultList="imgDefault"
        multiple
        @getImgBase64s="getImgBase64s"
        @removeImgBase64s="removeImgBase64s">
      </UploadPicBox>

			<p class="lxh-title-2">宣言介绍：</p>
      <quill-editor
        class="input-block"
        v-model.trim="content"
        ref="myQuillEditor"
        :options="editorOption">
        <!-- @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)" -->
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
import './signUp.scss'
import { addSignUpUser, getAllActivity, getOneSignUpUser, updateSignUpUser, queryStatistics } from '@/api'
import UploadPicBox from '@_com/uploadPic/uploadPic.vue'
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
  name: 'addSignUp',
  components: {
    UploadPicBox
  },
  data () {
    return {
      editorOption: {
        placeholder: '请输入',
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': (value) => {
                if (value) {
                  alert('此处宣言不可上传图片！')
                } else {
                  console.log('aa')
                }
              }
            }
          }
        }

      },
      // forms start
      activityId: '',
      name: '',
      virtualTicket: 0,
      phone: '',
      address: '',
      img: [],
      imgDefault: '',
      content: '',
      // forms end
      activitys: [],
      pageType: false,
      breadcrumbItem: [
        {
          title: '自主报名管理',
          to: '/signUp'
        },
        {
          title: '操作报名人'
        }
      ],
      currentImgDom: '',
      widthUnit: 'px',
      heightUnit: 'px',
      width: '',
      height: '',
      info: {},
      note: ''
    }
  },

  watch: {
    content () {
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
    this.getAllActivityName()
  },

  mounted () {
    let id = this.$route.query.id
    this.pageType = !!id
    if (id) {
      this.getOneSignUpUser(id)
    }
  },

  beforeCreate () {
    queryStatistics()
  },

  methods: {

    getOneSignUpUser (id) {
      getOneSignUpUser({ id: id }).then(result => {
        let res = result.data
        this.info = res.signUpUser
        this.name = res.signUpUser.userName
        this.virtualTicket = res.signUpUser.virtualTicket
        this.phone = res.signUpUser.phone
        this.address = res.signUpUser.address
        this.imgDefault = res.signUpUser.img
        this.content = res.signUpUser.content
        this.note = res.signUpUser.note
      })
    },
    submit () {
      if (!this.name || !this.phone || !this.address || !this.img.length) {
        this.$Message.warning('请全部填写')
        return
      }
      let params = {
        activityId: this.$route.query.aid,
        name: this.name,
        phone: this.phone,
        virtualTicket: this.virtualTicket,
        address: this.address,
        content: this.content,
        img: this.img.map(item => item.val),
        signType: this.info.signType || 0,
        checkStatus: this.info.checkStatus || 0,
        note: this.note
      }
      console.log(params)
      this.$Modal.confirm({
        content: `是否${this.pageType ? '修改' : '添加'}报名人？`,
        onOk: () => {
          this.setGlobalLoading(true)
          if (this.pageType) {
            let id = this.$route.query.id
            updateSignUpUser({
              ...params,
              id: id
            }).then(res => {
              this.$Message.info(`修改报名人成功`)
              this.$router.go(-1)
            }).finally(() => { this.setGlobalLoading(false) })
          } else {
            addSignUpUser(params).then(res => {
              this.$Message.info(`添加报名人成功`)
              this.$router.go(-1)
            }).finally(() => { this.setGlobalLoading(false) })
          }
        }
      })
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
    removeImgBase64s (id) {
      let index = this.img.findIndex(item => item.id === id)
      this.img.splice(index, 1)
    },
    getImgBase64s (base64) {
      if (base64.length) {
        this.img = base64
      } else {
        this.img.push(base64)
      }
    },
    getAllActivityName () {
      getAllActivity({
        length: 100,
        page: 1
      }).then(res => {
        let tableData = (res.data.list || []).map(item => {
          return {
            ...item,
            ...item.activity
          }
        })
        this.activitys = tableData.map(item => {
          return {
            img: JSON.parse(item.img || '[]')[0],
            name: item.name,
            id: item.id
          }
        })
      })
    }
  }
}
</script>
