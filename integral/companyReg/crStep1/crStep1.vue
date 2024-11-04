<template>
	<view>
		<view class="cr-tip">
			<view class="tip-title">{{$L('注意事项')}}</view>
			<view class="tip-content">{{$L('以下所需要上传的电子版资质文件仅支持JPG/GIF/PNG格式图片，大小请控制在1M之内。')}}</view>
		</view>

		<form @submit="step1Submit" class="paddingB220">

			<!-- 基本信息 -->
			<view class="form-item">
				<view class="form-item-title">{{apply_t==1?$L('公司及联系人信息'):$L('店铺及联系人信息')}}</view>
				<view class="form-list">
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title=' + (apply_t==1?$L('公司名称'):$L('店铺名称')) + '&type=text&key=company_name&val=' + company_name + '&step=1'">
						<label>{{apply_t==1?$L('公司名称'):$L('店铺名称')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{company_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="company_name" :value="company_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('所在地')+'&type=address&key=company_address&val=' + company_address + '&id=' + company_address_ids + '&step=1'">
						<label>{{$L('所在地')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{company_address}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="company_address" :value="company_address" class="hide"></input>
							<input type="text" name="company_address_ids" :value="company_address_ids" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('详细地址')+'&type=text&key=company_address_detail&val=' + company_address_detail + '&step=1'">
						<label>{{$L('详细地址')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{company_address_detail}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="company_address_detail" :value="company_address_detail" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('公司电话')+'&type=tel&key=company_phone&val=' + company_phone + '&step=1'"
					 v-if="apply_t==1">
						<label>{{$L('公司电话')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{company_phone}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="company_phone" :value="company_phone" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('员工总数')+'&type=number&key=company_employee_count&val=' + company_employee_count + '&step=1'"
					 v-if="apply_t==1">
						<label>{{$L('员工总数')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{company_employee_count}}{{$L('人')}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="company_employee_count" :value="company_employee_count" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('注册资金')+'&type=number&key=company_registered_capital&val=' + company_registered_capital + '&step=1'"
					 v-if="apply_t==1">
						<label>{{$L('注册资金')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{company_registered_capital}}{{$L('万元')}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="company_registered_capital" :value="company_registered_capital" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('联系人姓名')+'&type=text&key=contacts_name&val=' + contacts_name + '&step=1'">
						<label>{{$L('联系人姓名')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{contacts_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="contacts_name" :value="contacts_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('联系人电话')+'&type=phone&key=contacts_phone&val=' + contacts_phone + '&step=1'">
						<label>{{$L('联系人电话')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{contacts_phone}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="contacts_phone" :value="contacts_phone" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('电子邮箱')+'&type=email&key=contacts_email&val=' + contacts_email + '&step=1'">
						<label>{{$L('电子邮箱')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{contacts_email}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="contacts_email" :value="contacts_email" class="hide"></input>
						</view>
					</navigator>
				</view>
			</view>

			<!-- 个人入驻 身份证信息 -->
			<view class="form-item" v-if="apply_t==0">
				<view class="form-item-title">{{$L('身份证信息')}}</view>
				<view class="form-list">
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('姓名')+'&type=text&key=business_sphere&val=' + business_sphere + '&step=1'">
						<label>{{$L('姓名')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{business_sphere}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="business_sphere" :value="business_sphere" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('身份证号')+'&type=idcard&key=business_licence_number&val=' + business_licence_number + '&step=1'">
						<label>{{$L('身份证号')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{business_licence_number}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="business_licence_number" :value="business_licence_number" class="hide"></input>
						</view>
					</navigator>

					<view class="list bw">
						<label>{{$L('身份证扫描件')}}</label>
						<view class="list-right">
							<view class="upload-wrap" data-name="business_licence_number_electronic" @tap="uploadImg">
								<view class="clear" data-name="business_licence_number_electronic" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!business_licence_number_electronic_show"></image>
								<image class="newImg" :src="business_licence_number_electronic_show" mode="aspectFit" v-if="business_licence_number_electronic_show"></image>
							</view>
							<input type="text" name="business_licence_number_electronic" :value="business_licence_number_electronic" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>
				</view>
			</view>

			<!-- 企业入驻 法人信息 -->
			<view class="form-item" v-if="apply_t==1">
				<view class="form-item-title">{{$L('企业法定代表人信息')}}</view>
				<view class="form-list">
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('法人姓名')+'&type=text&key=legal_person_name&val=' + legal_person_name + '&step=1'">
						<label>{{$L('法人姓名')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{legal_person_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="legal_person_name" :value="legal_person_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('法人身份证号')+'&type=idcard&key=legal_licence_number&val=' + legal_licence_number + '&step=1'">
						<label>{{$L('法人身份证号')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{legal_licence_number}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="legal_licence_number" :value="legal_licence_number" class="hide"></input>
						</view>
					</navigator>
					
					<navigator class="list bw" hover-class="none">
						<label>{{$L('证件是否为长期')}}</label>
						<view class="list-right">
							<switch name="legal_licence_long_term" @tap.stop="legal_licence" :value='legal_licence_long_term' :checked="legal_licence_long_term==1" color="#f23030"></switch>	
						</view>
					</navigator>
					
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('证件有效期开始时间')+'&type=date&key=legal_licence_start&val=' + legal_licence_start + '&step=1'">
						<label>{{$L('证件有效期开始时间')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{legal_licence_start}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="legal_licence_start" :value="legal_licence_start" class="hide"></input>
						</view>
					</navigator>

					<navigator v-if="legal_licence_long_term==0" class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('证件有效期结束时间')+'&type=date&key=legal_licence_end&val=' + legal_licence_end + '&step=1'">
						<label>{{$L('证件有效期结束时间')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{legal_licence_end}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="legal_licence_end" :value="legal_licence_end" class="hide"></input>
						</view>
					</navigator>

					<view class="list bw">
						<label>{{$L('法人证件电子版(正面)')}}</label>
						<view class="list-right">
							<view class="upload-wrap" data-name="legal_licence_zheng_electronic" @tap="uploadImg">
								<view class="clear" data-name="legal_licence_zheng_electronic" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!legal_licence_zheng_electronic_show"></image>
								<image class="newImg" :src="legal_licence_zheng_electronic_show" mode="aspectFit" v-if="legal_licence_zheng_electronic_show"></image>
							</view>
							<input type="text" name="legal_licence_zheng_electronic" :value="legal_licence_zheng_electronic" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>

					<view class="list bw">
						<label>{{$L('法人证件电子版（反面）')}} </label>
						<view class="list-right">
							<view class="upload-wrap" data-name="legal_licence_fan_electronic" @tap="uploadImg">
								<view class="clear" data-name="legal_licence_fan_electronic" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!legal_licence_fan_electronic_show"></image>
								<image class="newImg" :src="legal_licence_fan_electronic_show" mode="aspectFit" v-if="legal_licence_fan_electronic_show"></image>
							</view>
							<input type="text" name="legal_licence_fan_electronic" :value="legal_licence_fan_electronic" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>

				</view>
			</view>

			<!-- 企业入驻 营业执照信息 -->
			<view class="form-item" v-if="apply_t==1">
				<view class="form-item-title">{{$L('营业执照信息（副本）')}}</view>
				<view class="form-list">
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('统一社会信用代码')+'&type=text&key=business_licence_number&val=' + business_licence_number + '&step=1'">
						<label>{{$L('统一社会信用代码')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{business_licence_number}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="business_licence_number" :value="business_licence_number" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('营业执照所在地')+'&type=address&key=business_licence_address&val=' + business_licence_address + '&id=' + business_licence_address_ids + '&step=1'">
						<label>{{$L('营业执照所在地')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{business_licence_address}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="business_licence_address" :value="business_licence_address" class="hide"></input>
							<input type="text" name="business_licence_address_ids" :value="business_licence_address_ids" class="hide"></input>
						</view>
					</navigator>
					<navigator class="list bw" hover-class="none">
						<label>{{$L('营业执照是否为长期')}}</label>
						<view class="list-right">
							<switch name="business_licence_long_term" @tap.stop="business_licence" :value='business_licence_long_term' :checked="business_licence_long_term==1" color="#f23030"></switch>	
						</view>
					</navigator>
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('营业执照有效期开始时间')+'&type=date&key=business_licence_start&val=' + business_licence_start + '&step=1'">
						<label>{{$L('营业执照有效期开始时间')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{business_licence_start}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="business_licence_start" :value="business_licence_start" class="hide"></input>
						</view>
					</navigator>

					<navigator v-if="business_licence_long_term==0" class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('营业执照有效期结束时间')+'&type=date&key=business_licence_end&val=' + business_licence_end + '&step=1'">
						<label>{{$L('营业执照有效期结束时间')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{business_licence_end}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="business_licence_end" :value="business_licence_end" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('法定经营范围')+'&type=text&key=business_sphere&val=' + business_sphere + '&step=1'">
						<label>{{$L('法定经营范围')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{business_sphere}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="business_sphere" :value="business_sphere" class="hide"></input>
						</view>
					</navigator>

					<view class="list bw">
						<label>{{$L('营业执照号电子版正面')}}</label>
						<view class="list-right">
							<view class="upload-wrap" data-name="business_licence_number_electronic" @tap="uploadImg">
								<view class="clear" data-name="business_licence_number_electronic" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!business_licence_number_electronic_show"></image>
								<image class="newImg" :src="business_licence_number_electronic_show" mode="aspectFit" v-if="business_licence_number_electronic_show"></image>
							</view>
							<input type="text" name="business_licence_number_electronic" :value="business_licence_number_electronic" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>

				</view>
			</view>

			<!-- 企业入驻 补充认证 -->
			<view class="form-item" v-if="apply_t==1">
				<view class="form-item-title">{{$L('补充认证')}}</view>
				<view class="form-list">
					<view class="list bw">
						<label>{{$L('补充认证图片一')}}</label>
						<view class="list-right">
							<view class="upload-wrap" data-name="vendor_add_img1" @tap="uploadImg">
								<view class="clear" data-name="vendor_add_img1" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!vendor_add_img1_show"></image>
								<image class="newImg" :src="vendor_add_img1_show" mode="aspectFit" v-if="vendor_add_img1_show"></image>
							</view>
							<input type="text" name="vendor_add_img1" :value="vendor_add_img1" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>

					<view class="list bw">
						<label>{{$L('补充认证图片二')}}</label>
						<view class="list-right">
							<view class="upload-wrap" data-name="vendor_add_img2" @tap="uploadImg">
								<view class="clear" data-name="vendor_add_img2" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!vendor_add_img2_show"></image>
								<image class="newImg" :src="vendor_add_img2_show" mode="aspectFit" v-if="vendor_add_img2_show"></image>
							</view>
							<input type="text" name="vendor_add_img2" :value="vendor_add_img2" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>
					<view class="list bw">
						<label>{{$L('补充认证图片三')}} </label>
						<view class="list-right">
							<view class="upload-wrap" data-name="vendor_add_img3" @tap="uploadImg">
								<view class="clear" data-name="vendor_add_img3" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!vendor_add_img3_show"></image>
								<image class="newImg" :src="vendor_add_img3_show" mode="aspectFit" v-if="vendor_add_img3_show"></image>
							</view>
							<input type="text" name="vendor_add_img3" :value="vendor_add_img3" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>

				</view>
			</view>

			<button form-type="submit" class="submit-btn">{{$L('下一步，提交财务资质')}}</button>
		</form>

		<common :title="$L('入驻信息')"></common>
	</view>
</template>

<script>
	
	function tip(txt, icon) {
		uni.showToast({
			title: txt,
			icon: icon ? icon : 'none'
		});
	}

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				apply_t: '',
				is_supplier: '',
				reapply: '0',
				key: "",
				company_address_ids: "",
				name: "",
				label: "",
				company_name: '',
				company_address: '',
				company_address_detail: '',
				company_phone: '',
				company_employee_count: '',
				company_registered_capital: '',
				contacts_name: '',
				contacts_phone: '',
				contacts_email: '',
				business_sphere: '',
				business_licence_number_electronic_show: '',
				business_licence_number_electronic: '',
				vendor_add_img3_show: '',
				vendor_add_img3: '',
				business_licence_number: '',
				legal_person_name: '',
				legal_licence_number: '',
				legal_licence_start: '',
				legal_licence_end: '',
				legal_licence_zheng_electronic_show: '',
				legal_licence_zheng_electronic: '',
				legal_licence_fan_electronic_show: '',
				legal_licence_fan_electronic: '',
				business_licence_address: '',
				business_licence_address_ids: '',
				business_licence_start: '',
				business_licence_end: '',
				vendor_add_img1_show: '',
				vendor_add_img1: '',
				vendor_add_img2_show: '',
				vendor_add_img2: '',
				business_licence_long_term:0,
				legal_licence_long_term:0,
				
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('入驻信息')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.setData({ ...options
			});
			this.initData();
		},
		methods: {
			// 提交表单
			step1Submit(e) {
				let params = e.detail.value;
				let {
					apply_t,
					is_supplier,
					reapply,
					key
				} = this;

				if (apply_t == 0) {
					if (!params.company_name) {
						tip(apply_t == 1 ? this.$L('请输入公司名称') : this.$L('请输入店铺名称'));
						return false;
					}

					if (!params.company_address) {
						tip(this.$L('请选择所在地'));
						return false;
					}

					if (!params.contacts_name) {
						tip(this.$L('请输入联系人姓名'));
						return false;
					}

					if (!params.company_address_detail) {
						tip(this.$L('请输入详细地址'));
						return false;
					}

					if (!params.contacts_phone) {
						tip(this.$L('请输入联系电话'));
						return false;
					}

					if (!params.contacts_email) {
						tip(this.$L('请输入电子邮箱'));
						return false;
					}

					if (!params.business_sphere) {
						tip(this.$L('请输入姓名'));
						return false;
					}

					if (!params.business_licence_number) {
						tip(this.$L('请输入身份证号'));
						return false;
					}

					if (!params.business_licence_number_electronic) {
						tip(this.$L('请上传身份证扫描件'));
						return false;
					}
				} else if (apply_t == 1) {
					if (!params.company_name) {
						tip(apply_t == 1 ? this.$L('请输入公司名称') : this.$L('请输入店铺名称'));
						return false;
					}

					if (!params.company_address) {
						tip(this.$L('请选择所在地'));
						return false;
					}

					if (!params.company_address_detail) {
						tip(this.$L('请输入详细地址'));
						return false;
					}

					if (!params.company_phone) {
						tip(this.$L('请输入公司电话'));
						return false;
					}

					if (!params.company_employee_count) {
						tip(this.$L('请输入员工总数'));
						return false;
					}

					if (!params.company_registered_capital) {
						tip(this.$L('请输入注册资金'));
						return false;
					}

					if (!params.contacts_name) {
						tip(this.$L('请输入联系人姓名'));
						return false;
					}

					if (!params.contacts_phone) {
						tip(this.$L('请输入联系人电话'));
						return false;
					}

					if (!params.contacts_email) {
						tip(this.$L('请输入电子邮箱'));
						return false;
					}

					if (!params.legal_person_name) {
						tip(this.$L('请输入法人姓名'));
						return false;
					}

					if (!params.legal_licence_number) {
						tip(this.$L('请输入法人身份证'));
						return false;
					}
					if (!params.legal_licence_start) {
						tip(this.$L('请选择证件有效期开始时间'));
						return false;
					}
					if(params.legal_licence_long_term==0){
						if (!params.legal_licence_end) {
							tip(this.$L('请选择证件有效期结束时间'));
							return false;
						}
					}

					if (!params.legal_licence_zheng_electronic) {
						tip(this.$L('请上传法人证件电子版(正面)'));
						return false;
					}

					if (!params.legal_licence_fan_electronic) {
						tip(this.$L('法人证件电子版（反面）'));
						return false;
					}

					if (!params.business_licence_number) {
						tip(this.$L('请输入统一社会信用代码'));
						return false;
					}

					if (!params.business_licence_address) {
						tip(this.$L('请选择营业执照所在地'));
						return false;
					}

					if (!params.business_licence_start) {
						tip(this.$L('请选择营业执照有效期开始时间'));
						return false;
					}
					if(params.business_licence_long_term==0){
						if (!params.business_licence_end) {
							tip(this.$L('请选择营业执照有效期结束时间'));
							return false;
						}
					}

					if (!params.business_sphere) {
						tip(this.$L('请输入法定经营范围'));
						return false;
					}

					if (!params.business_licence_number_electronic) {
						tip(this.$L('请上传营业执照号电子版正面'));
						return false;
					}
				}

				uni.request({
					url: getApp().globalData.ser_url +
						`/index.php?app=enterin&mod=step1&apply_t=${apply_t}&is_supplier=${is_supplier}&key=${key}&reapply=${reapply}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: res => {
						if (res.data.datas.state == 200) {
							uni.navigateTo({
								url: '/integral/companyReg/crStep2/crStep2?apply_t=' + apply_t + '&is_supplier=' + is_supplier +
									'&reapply=' + reapply
							});
						} else {
							uni.showToast({
								title: res.data.datas.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			//营业执照
			business_licence(){
				this.business_licence_long_term = this.business_licence_long_term==0 ? 1 : 0;
			},
			
			//证件
			legal_licence(){
				this.legal_licence_long_term = this.legal_licence_long_term==0 ? 1 : 0;
			},
			// 编辑
			crEdit(e) {
				if (e.key && e.val) {
					this.setData({
						[e.key]: e.val
					});
				}

				if (e.company_address_ids) {
					this.setData({
						company_address_ids: e.company_address_ids
					});
				} else if (e.business_licence_address_ids) {
					this.setData({
						company_address_ids: e.business_licence_address_ids
					});
				}
			},

			// 上传图片
			uploadImg(e) {
				let name = e.currentTarget.dataset.name;
				let {
					key,
					reapply
				} = this;
				let that = this;

				if (name) {
					uni.chooseImage({
						count: 1,

						success(res) {
							const tempFilePaths = res.tempFilePaths;
							uni.uploadFile({
								url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=uploadPic',
								filePath: tempFilePaths[0],
								name: 'upimg',
								formData: {
									key: key,
									name: 'upimg',
									reapply: reapply
								},

								success(res) {
									let data = JSON.parse(res.data);
									that.setData({
										[name + '_show']: data.datas.img_url,
										[name]: data.datas.name
									});
									uni.setStorage({
										key: 'enterin1_' + name + '_show',
										data: data.datas.img_url
									});
									uni.setStorage({
										key: 'enterin1_' + name,
										data: data.datas.name
									});
								}

							});
						}

					});
				}
			},

			clearImg(e) {
				let name = e.currentTarget.dataset.name;
				this.setData({
					[name]: '',
					[name + '_show']: ''
				});
			},

			// 初始化数据，从storage中获取
			initData() {
				let that = this;
				let {
					apply_t,
					is_supplier,
					reapply,
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url +
						`/index.php?app=enterin&mod=dataOfStep&key=${key}&apply_t=${apply_t}&is_supplier=${is_supplier}&reapply=${reapply}&step=1`,
					success: res => {
						if (res.data.datas.state == 200) {
							let data = res.data.datas.data;
							let hasData = {};

							for (let i in data) {
								if (data[i]) {
									if (i == 'company_address_show') {
										hasData['company_address'] = data[i];
									} else if (i == 'company_address') {
										hasData['company_address_ids'] = data[i];
									} else if (i == 'business_licence_address_show') {
										hasData['business_licence_address'] = data[i];
									} else if (i == 'business_licence_address') {
										hasData['business_licence_address_ids'] = data[i];
									} else {
										hasData[i] = data[i];
									}
								}
							}

							this.setData({ ...hasData
							});
						}

						uni.getStorageInfo({
							success: function(res) {
								if (res.keys.length) {
									res.keys.map(el => {
										if (el.indexOf('enterin1_') > -1) {
											// 获取所有入驻信息
											let label = el.substr(9);
											uni.getStorage({
												key: el,
												success: function(val) {
													that.setData({
														[label]: val.data
													});
												}
											});
										}
									});
								}
							}
						});
					}
				});
			}

		}
	};
</script>
<style>
	@import "../../common/crcommon.css";
</style>
